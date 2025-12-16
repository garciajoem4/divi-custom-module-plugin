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
			timerStartTime: null,
			timerPausedTime: 0,
			currentTimerRow: null,
			totalHours: 0,
			totalAmount: 0,
			loading: false,
			error: null,
			currentFilter: 'this_week', // For public view filtering
			startDate: '', // Custom start date for filtering
			endDate: '', // Custom end date for filtering
			contributors: [], // List of users who have used the timesheet tracker
			selectedRowsForInvoice: [], // Track which rows are selected for invoice generation
			config: {
				maxRows: config.maxRows || 10,
				defaultHourlyRate: parseFloat(config.defaultHourlyRate) || 15,
				defaultProject: config.defaultProject || '',
				presetTasks: config.presetTasks || [],
				currencySymbol: config.currencySymbol || '$',
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
				userDetails: config.userDetails || null,
				billTo: {
					name: config.billToName || '-',
					address: config.billToAddress || '-',
					city: config.billToCity || '-',
					postalCode: config.billToPostalCode || '-',
					country: config.billToCountry || '-',
					email: config.billToEmail || '-'
				}
			}
		};

		this.timerInterval = null;
		this.autoSaveInterval = null;
		
		if (!this.state.config.isLoggedIn) {
			// Load live public data for non-logged users
			this.loadPublicData();
		} else {
			// Load saved data from WordPress for logged users
			this.loadTimesheetData();
		}

		// Set up auto-save (less frequent for database operations)
		if (this.state.config.saveData && this.state.config.autoSaveInterval > 0) {
			this.autoSaveInterval = setInterval(() => {/* Lines 63-64 omitted */}, Math.max(this.state.config.autoSaveInterval, 5000)); // Minimum 5 seconds
		}
		
		// Add visibility change listener for background timer support
		document.addEventListener('visibilitychange', this.handleVisibilityChange);
		
		// Restore timer state if it was running before
		this.restoreTimerState();
	}	componentWillUnmount() {
		// Clear intervals
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		if (this.autoSaveInterval) {
			clearInterval(this.autoSaveInterval);
		}
		
		// Remove visibility change listener
		document.removeEventListener('visibilitychange', this.handleVisibilityChange);
		
		// Save timer state before unmounting
		if (this.state.timerRunning) {
			this.saveTimerState();
		}
	}

	// Background Timer Management
	getTimerStorageKey = () => {
		return `timesheet_timer_${this.state.config.userId || 'guest'}`;
	}

	saveTimerState = () => {
		if (!this.state.timerRunning) return;
		
		const timerState = {
			running: this.state.timerRunning,
			startTime: this.state.timerStartTime,
			pausedTime: this.state.timerPausedTime,
			currentRow: this.state.currentTimerRow,
			savedAt: Date.now()
		};
		
		try {
			localStorage.setItem(this.getTimerStorageKey(), JSON.stringify(timerState));
		} catch (error) {
			console.warn('Could not save timer state to localStorage:', error);
		}
	}

	restoreTimerState = () => {
		try {
			const savedState = localStorage.getItem(this.getTimerStorageKey());
			if (!savedState) return false;
			
			const timerState = JSON.parse(savedState);
			
			// Check if the saved timer is still valid (within last 24 hours)
			const maxAge = 24 * 60 * 60 * 1000; // 24 hours
			if (Date.now() - timerState.savedAt > maxAge) {
				localStorage.removeItem(this.getTimerStorageKey());
				return false;
			}
			
			if (timerState.running && timerState.startTime) {
				this.setState({
					timerRunning: true,
					timerStartTime: timerState.startTime,
					timerPausedTime: timerState.pausedTime || 0,
					currentTimerRow: timerState.currentRow
				});
				
				// Start the display update interval
				this.startTimerDisplay();
				return true;
			}
		} catch (error) {
			console.warn('Could not restore timer state from localStorage:', error);
			localStorage.removeItem(this.getTimerStorageKey());
		}
		
		return false;
	}

	clearTimerState = () => {
		try {
			localStorage.removeItem(this.getTimerStorageKey());
		} catch (error) {
			console.warn('Could not clear timer state from localStorage:', error);
		}
	}

	calculateElapsedTime = () => {
		if (!this.state.timerRunning || !this.state.timerStartTime) return 0;
		
		const now = Date.now();
		const elapsed = Math.floor((now - this.state.timerStartTime + this.state.timerPausedTime) / 1000);
		return Math.max(0, elapsed);
	}

	updateTimerDisplay = () => {
		if (!this.state.timerRunning) return;
		
		const elapsed = this.calculateElapsedTime();
		
		this.setState({ timerSeconds: elapsed }, () => {
			// Auto-save timer state periodically
			if (elapsed > 0 && elapsed % 30 === 0) { // Save every 30 seconds
				this.saveTimerState();
			}
		});
	}

	startTimerDisplay = () => {
		if (this.timerInterval) {
			clearInterval(this.timerInterval);
		}
		
		// Update immediately
		this.updateTimerDisplay();
		
		// Continue updating every second
		this.timerInterval = setInterval(this.updateTimerDisplay, 1000);
	}

	handleVisibilityChange = () => {
		if (!this.state.timerRunning) return;
		
		if (document.visibilityState === 'visible') {
			// Tab became visible - update timer display
			this.updateTimerDisplay();
			
			// Restart the display interval to ensure smooth updates
			this.startTimerDisplay();
		} else {
			// Tab became hidden - save current state
			this.saveTimerState();
		}
	}

	// Timer Functions
	startTimer = (rowIndex = null) => {
		if (this.state.timerRunning) return;

		const now = Date.now();
		
		this.setState({
			timerRunning: true,
			currentTimerRow: rowIndex,
			timerSeconds: 0,
			timerStartTime: now,
			timerPausedTime: 0
		}, () => {
			// Save initial timer state
			this.saveTimerState();
			
			// Start the display update interval
			this.startTimerDisplay();
		});

		if (this.state.config.timerSound) {
			this.playTimerSound('start');
		}
	}

	stopTimer = () => {
		if (!this.state.timerRunning) return;

		clearInterval(this.timerInterval);
		
		// Calculate final elapsed time from timestamps
		const finalElapsed = this.calculateElapsedTime();
		const hours = this.formatTimeToDecimal(finalElapsed);
		
		if (this.state.currentTimerRow !== null) {
			this.updateRowField(this.state.currentTimerRow, 'hours', hours.toString());
		}

		this.setState({
			timerRunning: false,
			currentTimerRow: null,
			timerSeconds: 0,
			timerStartTime: null,
			timerPausedTime: 0
		});

		// Clear saved timer state
		this.clearTimerState();

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
			timerSeconds: 0,
			timerStartTime: null,
			timerPausedTime: 0
		});
		
		// Clear saved timer state
		this.clearTimerState();
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

	// Invoice Row Selection Functions
	handleSelectRowForInvoice = (rowId, isSelected) => {
		this.setState(prevState => {
			const selectedRows = [...prevState.selectedRowsForInvoice];
			
			if (isSelected && !selectedRows.includes(rowId)) {
				selectedRows.push(rowId);
			} else if (!isSelected && selectedRows.includes(rowId)) {
				const index = selectedRows.indexOf(rowId);
				selectedRows.splice(index, 1);
			}
			
			return { selectedRowsForInvoice: selectedRows };
		});
	}

	handleSelectAllRowsForInvoice = (isSelected) => {
		this.setState(prevState => {
			if (isSelected) {
				// Select all rows
				const allRowIds = prevState.rows.map(row => row.id);
				return { selectedRowsForInvoice: allRowIds };
			} else {
				// Deselect all rows
				return { selectedRowsForInvoice: [] };
			}
		});
	}

	getSelectedRowsForInvoice = () => {
		return this.state.rows.filter(row => 
			this.state.selectedRowsForInvoice.includes(row.id)
		);
	}

	isRowSelectedForInvoice = (rowId) => {
		return this.state.selectedRowsForInvoice.includes(rowId);
	}

	areAllRowsSelectedForInvoice = () => {
		return this.state.rows.length > 0 && 
			   this.state.selectedRowsForInvoice.length === this.state.rows.length;
	}

	areSomeRowsSelectedForInvoice = () => {
		return this.state.selectedRowsForInvoice.length > 0 && 
			   this.state.selectedRowsForInvoice.length < this.state.rows.length;
	}

	// Row Management Functions
	addRow = () => {
		if (this.state.rows.length >= this.state.config.maxRows) return;

		const newRowId = 'temp_' + Date.now();
		const newRow = {
			id: newRowId, // Temporary ID until saved to database
			date: new Date().toISOString().split('T')[0],
			project: this.state.config.defaultProject,
			tasks: '',
			notes: '',
			hours: '',
			rate: this.state.config.defaultHourlyRate.toFixed(2),
			amount: '0.00',
			modified: true
		};

		this.setState(prevState => ({
			rows: [...prevState.rows, newRow],
			selectedRowsForInvoice: [...prevState.selectedRowsForInvoice, newRowId] // Auto-select new rows for invoice
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

		const rowToDelete = this.state.rows[index];

		this.setState(prevState => ({
			rows: prevState.rows.filter((_, i) => i !== index),
			selectedRowsForInvoice: prevState.selectedRowsForInvoice.filter(id => id !== rowToDelete.id), // Remove deleted row from selection
			currentTimerRow: prevState.currentTimerRow === index ? null : 
				(prevState.currentTimerRow > index ? prevState.currentTimerRow - 1 : prevState.currentTimerRow)
		}), this.calculateTotals);
	}

	clearAllRows = () => {
		this.resetTimer();
		this.setState({
			rows: [],
			selectedRowsForInvoice: [] // Clear invoice selections when clearing all rows
		}, () => {
			this.calculateTotals();
			this.addRow(); // Add one empty row
		});
	}

	// Confirmation dialog for row deletion
	confirmDeleteRow = (entryId, index) => {
		const row = this.state.rows[index];
		const projectInfo = row.project || 'Untitled Project';
		const dateInfo = row.date || 'No Date';
		const hoursInfo = row.hours || '0';
		
		const confirmMessage = `Are you sure you want to delete this timesheet entry?\n\nProject: ${projectInfo}\nDate: ${dateInfo}\nHours: ${hoursInfo}\n\nThis action cannot be undone.`;
		
		if (window.confirm(confirmMessage)) {
			this.deleteTimesheetEntry(entryId, index);
		}
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

			// Auto-calculate amount when hours change
			if (field === 'hours') {
				const hours = parseFloat(newRows[index].hours) || 0;
				const rate = this.state.config.defaultHourlyRate;
				const amount = (hours * rate).toFixed(this.state.config.decimalPlaces);
				newRows[index].amount = amount;
				newRows[index].rate = this.state.config.defaultHourlyRate.toFixed(2);
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

	// Filter handler for public view
	handleFilterChange = (filter) => {
		this.setState({ 
			currentFilter: filter,
			loading: filter !== 'custom' // Only show loading for non-custom filters
		});
		
		// Only load data immediately for non-custom filters
		// For custom filter, wait for user to select dates
		if (filter !== 'custom') {
			if (!this.state.config.isLoggedIn) {
				this.loadPublicData(filter);
			} else {
				this.loadTimesheetData(filter);
			}
		} else {
			// For custom filter, clear loading and wait for date selection
			this.setState({ loading: false });
		}
	}

	// Date range handlers
	handleStartDateChange = (date) => {
		this.setState({ startDate: date }, () => {
			// Auto-apply filter if both dates are set and filter is custom
			if (this.state.currentFilter === 'custom' && this.state.endDate && date) {
				this.applyCustomDateFilter(date, this.state.endDate);
			}
		});
	}

	handleEndDateChange = (date) => {
		this.setState({ endDate: date }, () => {
			// Auto-apply filter if both dates are set and filter is custom
			if (this.state.currentFilter === 'custom' && this.state.startDate && date) {
				this.applyCustomDateFilter(this.state.startDate, date);
			}
		});
	}

	applyCustomDateFilter = (startDate, endDate) => {
		// Validate date range
		if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
			console.warn('TimesheetTracker: Start date cannot be after end date');
			return;
		}

		this.setState({ loading: true });
		
		if (!this.state.config.isLoggedIn) {
			this.loadPublicData('custom', startDate, endDate);
		} else {
			this.loadTimesheetData('custom', startDate, endDate);
		}
	}

	// Demo Data for Non-Logged Users
	loadDemoData = () => {
		const demoRows = [
			{
				id: 'demo_1',
				date: '2024-03-15',
				project: 'Website Development',
				tasks: 'Frontend Development',
				notes: 'Created responsive navigation menu',
				hours: '3.5',
				rate: this.state.config.defaultHourlyRate.toFixed(2),
				amount: (3.5 * this.state.config.defaultHourlyRate).toFixed(2)
			},
			{
				id: 'demo_2',
				date: '2024-03-15',
				project: 'Website Development',
				tasks: 'Testing',
				notes: 'Cross-browser compatibility testing',
				hours: '2.0',
				rate: this.state.config.defaultHourlyRate.toFixed(2),
				amount: (2.0 * this.state.config.defaultHourlyRate).toFixed(2)
			},
			{
				id: 'demo_3',
				date: '2024-03-14',
				project: 'Mobile App',
				tasks: 'Documentation',
				notes: 'Updated API documentation',
				hours: '1.5',
				rate: this.state.config.defaultHourlyRate.toFixed(2),
				amount: (1.5 * this.state.config.defaultHourlyRate).toFixed(2)
			}
		];

		// Demo data is view-only, so no need to handle invoice selections
		this.setState({ rows: demoRows }, () => {
			this.calculateTotals();
		});
	}

	// Load public data from WordPress with filtering
	loadPublicData = async (filter = null, startDate = null, endDate = null) => {
		if (!this.state.config.ajaxUrl) {
			console.error('TimesheetTracker: AJAX URL not configured');
			return;
		}

		this.setState({ loading: true });

		const currentFilter = filter || this.state.currentFilter;

		const formData = new FormData();
		formData.append('action', 'timesheet_load_public_entries');
		formData.append('filter', currentFilter);

		// Add custom date range if provided
		if (currentFilter === 'custom' && startDate && endDate) {
			formData.append('start_date', startDate);
			formData.append('end_date', endDate);
		}

		try {
			const response = await fetch(this.state.config.ajaxUrl, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				const publicRows = result.data.entries.map((entry, index) => ({
					id: `public_${index}`,
					date: entry.entry_date,
					project: entry.project || '',
					tasks: entry.tasks || '',
					notes: entry.notes || '',
					hours: entry.hours || '0',
					rate: this.state.config.defaultHourlyRate.toFixed(2),
					amount: (parseFloat(entry.hours || 0) * this.state.config.defaultHourlyRate).toFixed(2)
				}));

				// Process contributor data
				const contributors = result.data.contributors || [];

				this.setState({ 
					rows: publicRows,
					contributors: contributors,
					loading: false,
					currentFilter: currentFilter 
				}, () => {
					this.calculateTotals();
				});
			} else {
				console.error('TimesheetTracker: Failed to load public data:', result.data);
				// If no data, show empty table
				this.setState({ 
					rows: [],
					contributors: [],
					loading: false 
				}, () => {
					this.calculateTotals();
				});
			}
		} catch (error) {
			console.error('TimesheetTracker: Error loading public data:', error);
			// Fallback to empty table on error
			this.setState({ 
				rows: [],
				contributors: [],
				loading: false 
			}, () => {
				this.calculateTotals();
			});
		}
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

	loadTimesheetData = async (filter = null, startDate = null, endDate = null) => {
		if (!this.state.config.saveData || !this.state.config.isLoggedIn) return;

		this.setState({ loading: true });

		const formData = new FormData();
		formData.append('action', 'timesheet_load_entries');
		formData.append('nonce', this.state.config.nonce);

		// Add custom date range if provided
		if (filter === 'custom' && startDate && endDate) {
			formData.append('start_date', startDate);
			formData.append('end_date', endDate);
		}

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

				// Initially select all loaded rows for invoice generation
				const allRowIds = entries.map(entry => entry.id);

				this.setState({ 
					rows: entries,
					selectedRowsForInvoice: allRowIds
				}, () => {
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

	// Export Functions
	exportToCSV = () => {
		const { rows, config, currentFilter } = this.state;
		const isViewOnly = config.viewOnly || !config.isLoggedIn;
		
		// CSV Headers - adjust for public view
		const headers = isViewOnly 
			? ['Date', 'Project', 'Tasks', 'Notes', 'Hours']
			: ['Date', 'Project', 'Tasks', 'Notes', 'Hours', 'Billable Rate', 'Billable Amount'];
		
		// CSV Content - adjust for public view
		const csvContent = [
			headers.join(','),
			...rows.map(row => {
				const baseRow = [
					row.date,
					`"${row.project}"`,
					`"${row.tasks}"`,
					`"${row.notes}"`,
					row.hours
				];
				
				// Add financial columns only for logged users
				if (!isViewOnly) {
					baseRow.push(`${config.currencySymbol}${config.defaultHourlyRate.toFixed(2)}`, `${config.currencySymbol}${row.amount}`);
				}
				
				return baseRow.join(',');
			})
		].join('\n');

		// Add totals row
		const totalHours = this.state.totalHours.toFixed(config.decimalPlaces);
		let totalsRow = `\n"TOTALS","","","",${totalHours}`;
		
		if (!isViewOnly) {
			const totalAmount = this.state.totalAmount.toFixed(config.decimalPlaces);
			totalsRow += `,"","${config.currencySymbol}${totalAmount}"`;
		}
		
		const finalCSV = csvContent + totalsRow;

		// Generate filename with filter information
		let filename = 'timesheet';
		
		const filterNames = {
			'this_week': 'this-week',
			'last_week': 'last-week',
			'this_month': 'this-month',
			'last_month': 'last-month',
			'custom': 'custom-range'
		};
		
		if (currentFilter === 'custom' && this.state.startDate && this.state.endDate) {
			filename += `_${this.state.startDate}_to_${this.state.endDate}`;
		} else {
			filename += `_${filterNames[currentFilter] || 'filtered'}`;
		}
		
		filename += `_${new Date().toISOString().split('T')[0]}.csv`;

		// Create and download file
		const blob = new Blob([finalCSV], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute('download', filename);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	generateInvoice = () => {
		const { config } = this.state;
		const selectedRows = this.getSelectedRowsForInvoice();
		
		// Don't generate invoice if no rows are selected
		if (selectedRows.length === 0) {
			alert('Please select at least one row to include in the invoice.');
			return;
		}
		
		const currentDate = new Date().toLocaleDateString();
		const invoiceNumber = `${Date.now()}`;
		
		// Calculate totals for selected rows only
		const selectedTotals = selectedRows.reduce((acc, row) => {
			const hours = parseFloat(row.hours) || 0;
			const amount = parseFloat(row.amount) || 0;
			return {
				hours: acc.hours + hours,
				amount: acc.amount + amount
			};
		}, { hours: 0, amount: 0 });
		
		// Create invoice HTML content
		const invoiceHTML = `
			<!DOCTYPE html>
			<html>
			<head>
				<title>Invoice - ${invoiceNumber}</title>
				<style>
					body { font-family: 'Poppins', Arial, sans-serif; margin: 40px; }
					.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
					.details { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
					.details .label { padding-right: 60px; }
					.invoice-subdetail { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; }
					.invoice-number { text-align: right; margin-bottom: 30px; }
					.invoice-details { margin-bottom: 20px; }
					.invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
					.invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
					.invoice-table th { background-color: #f8f9fa; }
					.totals { text-align: right; margin-top: 20px; font-weight: bold; }
					.amount { text-align: right; }
					.no-margin { margin: 0; }
					.no-margin-top { margin-top: 0; }
					.margin-balance { margin-top: 0; margin-bottom: 10px; }
					p { font-size: 12px; }
					table { font-size: 12px; }
					table th { font-size: 12px; }
					table td { font-size: 12px; }
				</style>
			</head>
			<body>
				<div class="header">
					<div class="company-info">
						<h2 class="margin-balance">Joemari Garcia</h2>
						<p class="margin-balance">P3B6L10 Garden Bloom Villas, Cotcot </p>
						<p class="margin-balance">Liloan Cebu,</p>
						<p class="margin-balance">6002,</p>
						<p class="margin-balance">Philippines</p>
						<p class="margin-balance">Email: garciajoema4@gmail.com</p>
					</div>
					<div class="invoice-number">
						<h3 class="no-margin">INVOICE #${invoiceNumber}</h3>
					</div>
				</div>
				<div class="details">
					<div class="dates">
						<div class="invoice-subdetail invoice-date">
							<div class="label"><p class="no-margin"><strong>Invoice Date</strong></p></div>
							<div class="value"><p class="no-margin">${currentDate}</p></div>
						</div>
						<div class="invoice-subdetail invoice-provided">
							<div class="label"><p class="no-margin"><strong>Services Provided</strong></p></div>
							<div class="value"><p class="no-margin">Web Development and Design</p></div>
						</div>
						<div class="invoice-subdetail invoice-total">
							<div class="label"><p class="no-margin"><strong>Invoice Total (${config.currencySymbol === '$' ? 'USD' : config.currencySymbol === '₱' ? 'PHP' : config.currencySymbol})</strong></p></div>
							<div class="value"><p class="no-margin">${config.currencySymbol} ${selectedTotals.amount.toFixed(config.decimalPlaces)}</p></div>
						</div>
					</div>
					<div class="bill-to">
						<div class="label"><p class="no-margin"><strong>Bill To</strong></p></div>
						<div class="value">
							<h3 class="margin-balance">${config.billTo.name}</h3>
							<p class="margin-balance">${config.billTo.address}</p>
							<p class="margin-balance">${config.billTo.city}</p>
							<p class="margin-balance">${config.billTo.postalCode}</p>
							<p class="margin-balance">${config.billTo.country}</p>
							<p class="margin-balance">Email: ${config.billTo.email}</p>
						</div>
					</div>
				</div>

				<table class="invoice-table">
					<thead>
						<tr>
							<th>Date</th>
							<th>Project</th>
							<th>Task Description</th>
							<th>Hours</th>
							<th>Rate</th>
							<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						${selectedRows.map(row => `
							<tr>
								<td>${row.date}</td>
								<td>${row.project}</td>
								<td>${row.tasks}${row.notes ? ' - ' + row.notes : ''}</td>
								<td>${row.hours}</td>
								<td>${config.currencySymbol}${config.defaultHourlyRate.toFixed(2)}</td>
								<td class="amount">${config.currencySymbol}${row.amount}</td>
							</tr>
						`).join('')}
					</tbody>
				</table>

				<div class="totals">
					<p><strong>Total Hours:</strong> ${selectedTotals.hours.toFixed(config.decimalPlaces)}</p>
					<p><strong>Total Amount: ${config.currencySymbol} ${selectedTotals.amount.toFixed(config.decimalPlaces)}</strong></p>
				</div>
			</body>
			</html>
		`;

		// Open in new window for printing
		const printWindow = window.open('', '_blank');
		printWindow.document.write(invoiceHTML);
		printWindow.document.close();
		printWindow.focus();
		setTimeout(() => {
			printWindow.print();
		}, 250);
	}

	// Render Helper Functions
	renderTaskOptions = () => {
		return this.state.config.presetTasks.map(task => (
			<option key={task} value={task}>{task}</option>
		));
	}

	render() {
		const { config, loading, error } = this.state;
		const isViewOnly = config.viewOnly || !config.isLoggedIn;

		// Show error message if there are other errors (but not for login requirements)
		if (error && config.isLoggedIn) {
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
						<div className="loading-spinner"></div>
					</div>
				)}
				
				{this.props.attrs?.table_title && (
					<div className="timesheet-title">
						<h3>{this.props.attrs.table_title}</h3>
					</div>
				)}

				{/* User Details and Timer Row */}
				<div className="info-timer-row">
					{/* User Details Display */}
					{this.state.config.userDetails && (
						<div className="user-details">
							<div className="user-info">
								<h4>User Information</h4>
								<div className="user-item">
									<strong>Name:</strong> {this.state.config.userDetails.name}
								</div>
								<div className="user-item">
									<strong>Email:</strong> {this.state.config.userDetails.email}
								</div>
								<div className="user-item">
									<strong>Last logged in:</strong> {this.state.config.userDetails.lastLogin}
								</div>
							</div>
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
				</div>

				{/* Contributors Display - Show in public view */}
				{isViewOnly && this.state.contributors.length > 0 && (
					<div className="contributors-section">
						<div className="contributors-header">
							<h4>User Details</h4>
						</div>
						<div className="contributors-list">
							{this.state.contributors.map((contributor, index) => (
								<div key={index} className="contributor-item">
									<div className="contributor-name">
										<strong>{contributor.name}</strong>
									</div>
									<div className="contributor-email">
										{contributor.email}
									</div>
									<div className="contributor-stats">
										<span className="total-hours">{parseFloat(contributor.total_hours).toFixed(2)} hours</span>
										<span className="total-entries">{contributor.total_entries} entries</span>
									</div>
									<div className="last-activity">
										Last active: {new Date(contributor.last_activity).toLocaleString()}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="timesheet-container">
					<div className="timesheet-controls">
						{(isViewOnly || config.isLoggedIn) && (
							<div className="filter-controls">
								<label htmlFor="time-filter">Filter by:</label>
								<select 
									id="time-filter"
									value={this.state.currentFilter} 
									onChange={(e) => this.handleFilterChange(e.target.value)}
									className="filter-dropdown"
								>
									<option value="this_week">This Week</option>
									<option value="last_week">Last Week</option>
									<option value="this_month">This Month</option>
									<option value="last_month">Last Month</option>
									<option value="custom">Custom Date Range</option>
								</select>

								{this.state.currentFilter === 'custom' && (
									<div className="custom-date-controls">
										<div className="date-input-group">
											<label htmlFor="start-date">From:</label>
											<input
												type="date"
												id="start-date"
												value={this.state.startDate}
												onChange={(e) => this.handleStartDateChange(e.target.value)}
												className="date-input"
											/>
										</div>
										<div className="date-input-group">
											<label htmlFor="end-date">To:</label>
											<input
												type="date"
												id="end-date"
												value={this.state.endDate}
												onChange={(e) => this.handleEndDateChange(e.target.value)}
												className="date-input"
											/>
										</div>
										<button
											className="apply-filter-btn"
											onClick={() => this.applyCustomDateFilter(this.state.startDate, this.state.endDate)}
											disabled={!this.state.startDate || !this.state.endDate || loading}
											title="Apply custom date filter"
										>
											Apply Filter
										</button>
									</div>
								)}
							</div>
						)}
						
						{!isViewOnly && (
							<>
								<button 
									className="add-row-btn"
									onClick={this.addRow}
									disabled={this.state.rows.length >= config.maxRows}
								>
									+ Add Row
								</button>
								{/* <button 
									className="clear-all-btn"
									onClick={this.clearAllRows}
								>
									Clear All
								</button> */}
							</>
						)}
						
						<div className="export-controls">
							<button 
								className="export-btn"
								onClick={this.exportToCSV}
								title="Export to CSV"
							>
								Export CSV
							</button>
							{config.isLoggedIn && (
								<button 
									className="invoice-btn"
									onClick={this.generateInvoice}
									disabled={this.state.selectedRowsForInvoice.length === 0}
									title={`Generate Invoice for ${this.state.selectedRowsForInvoice.length} selected row(s)`}
								>
									Generate Invoice ({this.state.selectedRowsForInvoice.length})
								</button>
							)}
						</div>
						
						<div className="total-summary">
							<span className="total-hours">
								Total Hours: <strong>{this.state.totalHours.toFixed(config.decimalPlaces)}</strong>
							</span>
							{!isViewOnly && (
								<span className="total-amount">
									Total Amount: <strong>{config.currencySymbol}{this.state.totalAmount.toFixed(config.decimalPlaces)}</strong>
								</span>
							)}
						</div>
					</div>
					
					<div className="timesheet-table-wrapper">
						<table className="timesheet-table">
							<thead className="timesheet-header">
								<tr>
									{!isViewOnly && config.isLoggedIn && (
										<th className="checkbox-column th-checkbox">
											<input
												type="checkbox"
												checked={this.areAllRowsSelectedForInvoice()}
												ref={checkbox => {
													if (checkbox) checkbox.indeterminate = this.areSomeRowsSelectedForInvoice();
												}}
												onChange={(e) => this.handleSelectAllRowsForInvoice(e.target.checked)}
												title="Select all rows for invoice"
											/>
										</th>
									)}
									<th className="th-date">Date</th>
									<th className="th-project">Project</th>
									<th className="th-tasks">Tasks</th>
									<th className="th-notes">Notes</th>
									<th className="th-hours">Hours</th>
									{!isViewOnly && <th className="th-rate">Billable Rate</th>}
									{!isViewOnly && <th className="th-amount">Billable Amount</th>}
									{!isViewOnly && <th className="th-actions">Actions</th>}
								</tr>
							</thead>
							<tbody className="timesheet-body">
								{this.state.rows.map((row, index) => (
									<tr key={row.id} className="timesheet-row">
										{!isViewOnly && config.isLoggedIn && (
											<td className="checkbox-column td-checkbox">
												<input
													type="checkbox"
													checked={this.isRowSelectedForInvoice(row.id)}
													onChange={(e) => this.handleSelectRowForInvoice(row.id, e.target.checked)}
													title="Select for invoice"
												/>
											</td>
										)}
										<td className="td-date">
											{isViewOnly ? (
												<div className="readonly-field">{row.date}</div>
											) : (
												<input
													type="date"
													value={row.date}
													onChange={(e) => this.updateRowField(index, 'date', e.target.value)}
												/>
											)}
										</td>
										<td className="td-project">
											{isViewOnly ? (
												<div className="readonly-field">{row.project}</div>
											) : (
												<input
													type="text"
													value={row.project}
													placeholder="Project name"
													onChange={(e) => this.updateRowField(index, 'project', e.target.value)}
												/>
											)}
										</td>
										<td className="td-tasks">
											{isViewOnly ? (
												<div className="readonly-field">{row.tasks}</div>
											) : (
												config.presetTasks.length > 0 ? (
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
												)
											)}
										</td>
										<td className="td-notes">
											{isViewOnly ? (
												<div className="readonly-field">{row.notes}</div>
											) : (
												<textarea
													value={row.notes}
													placeholder="Notes"
													rows="1"
													onChange={(e) => this.updateRowField(index, 'notes', e.target.value)}
												/>
											)}
										</td>
										<td className="td-hours">
											{isViewOnly ? (
												<div className="readonly-field hours-display">{row.hours}</div>
											) : (
												<input
													type="number"
													step="0.01"
													min="0"
													value={row.hours}
													placeholder="0.00"
													onChange={(e) => this.updateRowField(index, 'hours', e.target.value)}
												/>
											)}
										</td>
										{!isViewOnly && (
											<td className="td-rate">
												<div className="fixed-rate-display">
													{config.currencySymbol}15.00
												</div>
											</td>
										)}
										{!isViewOnly && (
											<td className="amount-cell td-amount">
												{config.currencySymbol}{row.amount}
											</td>
										)}
										{!isViewOnly && (
											<td className="actions-cell td-actions">
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
													onClick={() => this.confirmDeleteRow(row.id, index)}
													title="Delete Row"
													disabled={loading}
												>
													🗑
												</button>
											</td>
										)}
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