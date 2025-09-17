import { Component } from 'react';
import './style.css';

class TimesheetTracker extends Component {
	constructor(props) {
		super(props);
		
		// Parse configuration from props
		const config = this.props.attrs?.config ? JSON.parse(this.props.attrs.config) : {};
		
		this.state = {
			rows: [],
			timerRunning: false,
			timerSeconds: 0,
			currentTimerRow: null,
			totalHours: 0,
			totalAmount: 0,
			loading: false,
			error: null,
			config: {
				maxRows: config.maxRows || 10,
				defaultHourlyRate: config.defaultHourlyRate || 50,
				defaultProject: config.defaultProject || '',
				presetTasks: config.presetTasks || [],
				currencySymbol: '$', // USD currency
				decimalPlaces: config.decimalPlaces || 2,
				timeFormat: config.timeFormat || 'decimal',
				saveData: config.saveData !== false,
				autoSaveInterval: config.autoSaveInterval || 10000,
				timerAutoStart: config.timerAutoStart || false,
				timerSound: config.timerSound || false,
				showTimer: config.showTimer !== false,
				// WordPress-specific config
				userId: config.userId || 0,
				isLoggedIn: config.isLoggedIn || false,
				ajaxUrl: config.ajaxUrl || '',
				nonce: config.nonce || '',
			}
		};

		this.timerInterval = null;
		this.autoSaveInterval = null;
	}

	componentDidMount() {
		// Check if user is logged in
		if (!this.state.config.isLoggedIn) {
			this.setState({ error: 'Please log in to use the timesheet tracker.' });
			return;
		}

		// Load saved data from WordPress
		this.loadTimesheetData();

		// Set up auto-save (less frequent for database operations)
		if (this.state.config.saveData && this.state.config.autoSaveInterval > 0) {
			this.autoSaveInterval = setInterval(() => {
				this.saveAllPendingChanges();
			}, Math.max(this.state.config.autoSaveInterval, 5000)); // Minimum 5 seconds
		}
	}

	componentWillUnmount() {
		// Clear intervals
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		if (this.autoSaveInterval) {
			clearInterval(this.autoSaveInterval);
		}
	}

	// Timer Functions
	startTimer = (rowIndex = null) => {
		if (this.state.timerRunning) return;

		this.setState({
			timerRunning: true,
			currentTimerRow: rowIndex,
			timerSeconds: 0
		});

		this.timerInterval = setInterval(() => {
			this.setState(prevState => ({
				timerSeconds: prevState.timerSeconds + 1
			}));
		}, 1000);

		if (this.state.config.timerSound) {
			this.playTimerSound('start');
		}
	}

	stopTimer = () => {
		if (!this.state.timerRunning) return;

		clearInterval(this.timerInterval);
		
		// Calculate hours and update the current row
		const hours = this.formatTimeToDecimal(this.state.timerSeconds);
		
		if (this.state.currentTimerRow !== null) {
			this.updateRowField(this.state.currentTimerRow, 'hours', hours.toString());
		}

		this.setState({
			timerRunning: false,
			currentTimerRow: null,
			timerSeconds: 0
		});

		if (this.state.config.timerSound) {
			this.playTimerSound('stop');
		}
	}

	resetTimer = () => {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		
		this.setState({
			timerRunning: false,
			currentTimerRow: null,
			timerSeconds: 0
		});
	}

	playTimerSound = (type) => {
		// Simple audio feedback using Web Audio API
		if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
			const audioContext = new (AudioContext || webkitAudioContext)();
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.frequency.value = type === 'start' ? 800 : 400;
			oscillator.type = 'sine';

			gainNode.gain.setValueAtTime(0, audioContext.currentTime);
			gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

			oscillator.start(audioContext.currentTime);
			oscillator.stop(audioContext.currentTime + 0.2);
		}
	}

	// Row Management Functions
	addRow = () => {
		if (this.state.rows.length >= this.state.config.maxRows) return;

		const newRow = {
			id: 'temp_' + Date.now(), // Temporary ID until saved to database
			date: new Date().toISOString().split('T')[0],
			project: this.state.config.defaultProject,
			tasks: '',
			notes: '',
			hours: '',
			rate: this.state.config.defaultHourlyRate.toString(),
			amount: '0.00',
			modified: true
		};

		this.setState(prevState => ({
			rows: [...prevState.rows, newRow]
		}), () => {
			this.calculateTotals();
			if (this.state.config.timerAutoStart && this.state.config.showTimer) {
				this.startTimer(this.state.rows.length - 1);
			}
		});
	}

	deleteRow = (index) => {
		// Stop timer if deleting the current timer row
		if (this.state.currentTimerRow === index) {
			this.stopTimer();
		}

		this.setState(prevState => ({
			rows: prevState.rows.filter((_, i) => i !== index),
			currentTimerRow: prevState.currentTimerRow === index ? null : 
				(prevState.currentTimerRow > index ? prevState.currentTimerRow - 1 : prevState.currentTimerRow)
		}), this.calculateTotals);
	}

	clearAllRows = () => {
		this.resetTimer();
		this.setState({
			rows: []
		}, () => {
			this.calculateTotals();
			this.addRow(); // Add one empty row
		});
	}

	// Field Update Functions
	updateRowField = (index, field, value) => {
		this.setState(prevState => {
			const newRows = [...prevState.rows];
			newRows[index] = {
				...newRows[index],
				[field]: value,
				modified: true // Mark as modified for auto-save
			};

			// Auto-calculate amount when hours or rate change
			if (field === 'hours' || field === 'rate') {
				const hours = parseFloat(newRows[index].hours) || 0;
				const rate = parseFloat(newRows[index].rate) || 0;
				const amount = (hours * rate).toFixed(this.state.config.decimalPlaces);
				newRows[index].amount = amount;
			}

			return { rows: newRows };
		}, () => {
			this.calculateTotals();
			// Debounced save to WordPress
			this.debouncedSave(index);
		});
	}

	// Debounced save function
	debouncedSave = (() => {
		const timeouts = {};
		return (index) => {
			clearTimeout(timeouts[index]);
			timeouts[index] = setTimeout(() => {
				const row = this.state.rows[index];
				if (row && row.modified) {
					this.saveTimesheetEntry(row, index);
				}
			}, 2000); // Save 2 seconds after user stops typing
		};
	})();

	// Calculation Functions
	calculateTotals = () => {
		const totals = this.state.rows.reduce((acc, row) => {
			const hours = parseFloat(row.hours) || 0;
			const amount = parseFloat(row.amount) || 0;
			return {
				hours: acc.hours + hours,
				amount: acc.amount + amount
			};
		}, { hours: 0, amount: 0 });

		this.setState({
			totalHours: totals.hours,
			totalAmount: totals.amount
		});
	}

	// Time Formatting Functions
	formatTimeDisplay = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	formatTimeToDecimal = (seconds) => {
		return (seconds / 3600).toFixed(this.state.config.decimalPlaces);
	}

	// WordPress Data Persistence Functions
	saveTimesheetEntry = async (rowData, index = null) => {
		if (!this.state.config.saveData || !this.state.config.isLoggedIn) return;

		this.setState({ loading: true });

		const formData = new FormData();
		formData.append('action', 'timesheet_save_entry');
		formData.append('nonce', this.state.config.nonce);
		
		if (rowData.id && rowData.id !== 'temp') {
			formData.append('entry_id', rowData.id);
		}
		
		formData.append('entry_date', rowData.date);
		formData.append('project', rowData.project);
		formData.append('tasks', rowData.tasks);
		formData.append('notes', rowData.notes);
		formData.append('hours', rowData.hours);
		formData.append('billable_rate', rowData.rate);

		try {
			const response = await fetch(this.state.config.ajaxUrl, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				// Update the row with the database ID
				if (index !== null && result.data.entry_id) {
					this.setState(prevState => {
						const newRows = [...prevState.rows];
						newRows[index] = { ...newRows[index], id: result.data.entry_id };
						return { rows: newRows };
					});
				}
			} else {
				console.error('Failed to save entry:', result.data.message);
				this.setState({ error: 'Failed to save entry: ' + result.data.message });
			}
		} catch (error) {
			console.error('Error saving timesheet entry:', error);
			this.setState({ error: 'Network error while saving entry' });
		} finally {
			this.setState({ loading: false });
		}
	}

	loadTimesheetData = async () => {
		if (!this.state.config.saveData || !this.state.config.isLoggedIn) return;

		this.setState({ loading: true });

		const formData = new FormData();
		formData.append('action', 'timesheet_load_entries');
		formData.append('nonce', this.state.config.nonce);

		try {
			const response = await fetch(this.state.config.ajaxUrl, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				const entries = result.data.entries.map(entry => ({
					id: entry.id,
					date: entry.entry_date,
					project: entry.project,
					tasks: entry.tasks,
					notes: entry.notes,
					hours: entry.hours,
					rate: entry.billable_rate,
					amount: entry.billable_amount
				}));

				this.setState({ rows: entries }, () => {
					this.calculateTotals();
					// If no entries, add one empty row
					if (entries.length === 0) {
						this.addRow();
					}
				});
			} else {
				console.error('Failed to load entries:', result.data.message);
				this.setState({ error: 'Failed to load entries: ' + result.data.message });
				// Add one empty row on error
				this.addRow();
			}
		} catch (error) {
			console.error('Error loading timesheet data:', error);
			this.setState({ error: 'Network error while loading data' });
			// Add one empty row on error
			this.addRow();
		} finally {
			this.setState({ loading: false });
		}
	}

	deleteTimesheetEntry = async (entryId, index) => {
		if (!entryId || entryId === 'temp') {
			// Just remove from local state if it's a temporary entry
			this.deleteRow(index);
			return;
		}

		this.setState({ loading: true });

		const formData = new FormData();
		formData.append('action', 'timesheet_delete_entry');
		formData.append('nonce', this.state.config.nonce);
		formData.append('entry_id', entryId);

		try {
			const response = await fetch(this.state.config.ajaxUrl, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				this.deleteRow(index);
			} else {
				console.error('Failed to delete entry:', result.data.message);
				this.setState({ error: 'Failed to delete entry: ' + result.data.message });
			}
		} catch (error) {
			console.error('Error deleting timesheet entry:', error);
			this.setState({ error: 'Network error while deleting entry' });
		} finally {
			this.setState({ loading: false });
		}
	}

	saveAllPendingChanges = () => {
		// Save all rows that have been modified
		this.state.rows.forEach((row, index) => {
			if (row.modified) {
				this.saveTimesheetEntry(row, index);
			}
		});
	}

	// Render Helper Functions
	renderTaskOptions = () => {
		return this.state.config.presetTasks.map(task => (
			<option key={task} value={task}>{task}</option>
		));
	}

	render() {
		const { config, loading, error } = this.state;

		// Show error message if user not logged in or other errors
		if (error) {
			return (
				<div className="dicm-timesheet-tracker error-state">
					<div className="error-message">
						<p>{error}</p>
					</div>
				</div>
			);
		}

		return (
			<div className="dicm-timesheet-tracker">
				{loading && (
					<div className="loading-overlay">
						<div className="loading-spinner">Saving...</div>
					</div>
				)}
				
				{this.props.attrs?.table_title && (
					<div className="timesheet-title">
						<h3>{this.props.attrs.table_title}</h3>
					</div>
				)}

				{config.showTimer && (
					<div className="timer-section">
						<div className="timer-display">
							<span className="timer-time">
								{this.formatTimeDisplay(this.state.timerSeconds)}
							</span>
							<div className="timer-controls">
								{!this.state.timerRunning ? (
									<button 
										className="timer-btn start-btn" 
										onClick={() => this.startTimer()}
									>
										<span className="btn-text">Start</span>
									</button>
								) : (
									<button 
										className="timer-btn stop-btn"
										onClick={this.stopTimer}
									>
										<span className="btn-text">Stop</span>
									</button>
								)}
								<button 
									className="timer-btn reset-btn"
									onClick={this.resetTimer}
								>
									<span className="btn-text">Reset</span>
								</button>
							</div>
						</div>
					</div>
				)}

				<div className="timesheet-container">
					<div className="timesheet-controls">
						<button 
							className="add-row-btn"
							onClick={this.addRow}
							disabled={this.state.rows.length >= config.maxRows}
						>
							+ Add Row
						</button>
						<button 
							className="clear-all-btn"
							onClick={this.clearAllRows}
						>
							Clear All
						</button>
						<div className="total-summary">
							<span className="total-hours">
								Total Hours: <strong>{this.state.totalHours.toFixed(config.decimalPlaces)}</strong>
							</span>
							<span className="total-amount">
								Total Amount: <strong>${this.state.totalAmount.toFixed(config.decimalPlaces)}</strong>
							</span>
						</div>
					</div>
					
					<div className="timesheet-table-wrapper">
						<table className="timesheet-table">
							<thead className="timesheet-header">
								<tr>
									<th>Date</th>
									<th>Project</th>
									<th>Tasks</th>
									<th>Notes</th>
									<th>Hours</th>
									<th>Billable Rate</th>
									<th>Billable Amount</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody className="timesheet-body">
								{this.state.rows.map((row, index) => (
									<tr key={row.id} className="timesheet-row">
										<td>
											<input
												type="date"
												value={row.date}
												onChange={(e) => this.updateRowField(index, 'date', e.target.value)}
											/>
										</td>
										<td>
											<input
												type="text"
												value={row.project}
												placeholder="Project name"
												onChange={(e) => this.updateRowField(index, 'project', e.target.value)}
											/>
										</td>
										<td>
											{config.presetTasks.length > 0 ? (
												<select
													value={row.tasks}
													onChange={(e) => this.updateRowField(index, 'tasks', e.target.value)}
												>
													<option value="">Select task...</option>
													{this.renderTaskOptions()}
												</select>
											) : (
												<input
													type="text"
													value={row.tasks}
													placeholder="Task description"
													onChange={(e) => this.updateRowField(index, 'tasks', e.target.value)}
												/>
											)}
										</td>
										<td>
											<textarea
												value={row.notes}
												placeholder="Notes"
												rows="1"
												onChange={(e) => this.updateRowField(index, 'notes', e.target.value)}
											/>
										</td>
										<td>
											<input
												type="number"
												step="0.01"
												min="0"
												value={row.hours}
												placeholder="0.00"
												onChange={(e) => this.updateRowField(index, 'hours', e.target.value)}
											/>
										</td>
										<td>
											<input
												type="number"
												step="0.01"
												min="0"
												value={row.rate}
												placeholder={config.defaultHourlyRate}
												onChange={(e) => this.updateRowField(index, 'rate', e.target.value)}
											/>
										</td>
										<td className="amount-cell">
											${row.amount}
										</td>
										<td className="actions-cell">
											{config.showTimer && (
												<button
													className={`timer-row-btn ${this.state.currentTimerRow === index ? 'active' : ''}`}
													onClick={() => 
														this.state.currentTimerRow === index ? 
														this.stopTimer() : 
														this.startTimer(index)
													}
													disabled={this.state.timerRunning && this.state.currentTimerRow !== index}
													title={this.state.currentTimerRow === index ? 'Stop Timer' : 'Start Timer'}
												>
													{this.state.currentTimerRow === index ? '⏹' : '▶'}
												</button>
											)}
											<button
												className="delete-row-btn"
												onClick={() => this.deleteTimesheetEntry(row.id, index)}
												title="Delete Row"
												disabled={loading}
											>
												🗑
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

export default TimesheetTracker;