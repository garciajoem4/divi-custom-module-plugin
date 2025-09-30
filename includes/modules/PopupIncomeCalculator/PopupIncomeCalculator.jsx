import { Component } from 'react';
import './style.css';

class PopupIncomeCalculator extends Component {
	constructor(props) {
		super(props);
		
		// Parse configuration from props
		const config = this.props.attrs?.config ? JSON.parse(this.props.attrs.config) : {};
		
		this.state = {
			isChatboxOpen: false,
			selectedModel: config.defaultModel || 'WE BUY. WE OWN. WE FILL',
			transactions: config.defaultTransactions || 125,
			ourShare: 70,
			yourShare: 30,
			incomeExpectation: 131.25,
			config: {
				buttonText: config.buttonText || 'CALCULATE INCOME',
				popupTitle: config.popupTitle || 'GET STARTED WITH YOUR INCOME',
				feeAmount: config.feeAmount || 3.5
			}
		};
	}

	componentDidMount() {
		// Calculate initial values
		this.calculateShares();
	}

	// Toggle chatbox visibility
	toggleChatbox = () => {
		this.setState(prevState => ({
			isChatboxOpen: !prevState.isChatboxOpen
		}));
	}

	// Handle model selection change
	handleModelChange = (event) => {
		this.setState({ 
			selectedModel: event.target.value 
		}, () => {
			this.calculateShares();
		});
	}

	// Handle transaction count change
	updateTransactions = (newCount) => {
		const transactions = Math.max(1, newCount); // Minimum 1 transaction
		this.setState({ transactions }, () => {
			this.calculateShares();
		});
	}

	// Handle direct input change for transactions
	handleTransactionInputChange = (event) => {
		const value = parseInt(event.target.value) || 1;
		this.updateTransactions(value);
	}

	// Calculate shares based on model and transaction count
	calculateShares = () => {
		const { selectedModel, transactions } = this.state;
		let ourShare, yourShare;

		if (selectedModel === 'WE BUY. WE OWN. WE FILL') {
			if (transactions >= 1 && transactions <= 100) {
				ourShare = 75;
				yourShare = 25;
			} else if (transactions >= 101 && transactions <= 150) {
				ourShare = 70;
				yourShare = 30;
			} else if (transactions >= 151 && transactions <= 250) {
				ourShare = 65;
				yourShare = 35;
			} else { // 250+
				ourShare = 50;
				yourShare = 50;
			}
		} else { // YOU BUY. YOU OWN. WE FILL
			if (transactions >= 1 && transactions <= 100) {
				ourShare = 50;
				yourShare = 50;
			} else if (transactions >= 101 && transactions <= 150) {
				ourShare = 55;
				yourShare = 45;
			} else if (transactions >= 151 && transactions <= 250) {
				ourShare = 60;
				yourShare = 40;
			} else if (transactions >= 251 && transactions <= 300) {
				ourShare = 65;
				yourShare = 35;
			} else { // 300+
				ourShare = 70;
				yourShare = 30;
			}
		}

		// Calculate income expectation: transactions * your_share * fee_amount
		const incomeExpectation = transactions * (yourShare / 100) * this.state.config.feeAmount;

		this.setState({
			ourShare,
			yourShare,
			incomeExpectation
		});
	}

	render() {
		const { isChatboxOpen, selectedModel, transactions, ourShare, yourShare, incomeExpectation, config } = this.state;

		return (
			<div className="income-calculator-chatbox">
				{/* Chatbox Widget */}
				<div className={`chatbox-widget ${isChatboxOpen ? 'open' : 'closed'}`}>
					{/* Chatbox Header */}
					<div className="chatbox-header" onClick={this.toggleChatbox}>
						<h3>{isChatboxOpen ? config.popupTitle : 'CALCULATE INCOME'}</h3>
						{/* <button className="chatbox-toggle">
							{isChatboxOpen ? '−' : '+'}
						</button> */}
					</div>

					{/* Chatbox Content */}
					{isChatboxOpen && (
						<div className="chatbox-content">
							{/* Model Selection Dropdown */}
							<div className="model-selector">
								<select 
									value={selectedModel} 
									onChange={this.handleModelChange}
									className="model-dropdown"
								>
									<option value="WE BUY. WE OWN. WE FILL">WE BUY. WE OWN. WE FILL</option>
									<option value="YOU BUY. YOU OWN. WE FILL">YOU BUY. YOU OWN. WE FILL</option>
								</select>
							</div>

							{/* Transactions Counter */}
							<div className="transactions-section">
								<h4>TRANSACTIONS</h4>
								<div className="transaction-counter">
									<button 
										className="counter-btn minus"
										onClick={() => this.updateTransactions(transactions - 1)}
									>
										−
									</button>
									<input
										type="number"
										className="transaction-input"
										value={transactions}
										onChange={this.handleTransactionInputChange}
										min="1"
										max="999"
									/>
									<button 
										className="counter-btn plus"
										onClick={() => this.updateTransactions(transactions + 1)}
									>
										+
									</button>
								</div>
							</div>

							{/* Share Display */}
							<div className="shares-section">
								<div className="share-box our-share">
									<div className="share-label">OUR SHARE</div>
									<div className="share-percentage">{ourShare}%</div>
								</div>
								<div className="share-box your-share">
									<div className="share-label">YOUR SHARE</div>
									<div className="share-percentage">{yourShare}%</div>
								</div>
							</div>

							{/* Income Expectations */}
							<div className="income-section">
								<div className="income-label">
									INCOME EXPECTATIONS<br />
									@ ${config.feeAmount.toFixed(2)} FEE
								</div>
								<div className="income-amount">
									${incomeExpectation.toFixed(0)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

export default PopupIncomeCalculator;