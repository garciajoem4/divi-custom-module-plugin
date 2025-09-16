// External Dependencies
import { Component } from 'react';

// Internal Dependencies
import './style.css';

class IncomeCalculator extends Component {

  static slug = 'dicm_income_calculator';

  constructor(props) {
    super(props);
    this.state = {
      transactionInputs: [0, 0, 0, 0, 0],
      autoCorrectedIndex: -1
    };
  }

  handleInputChange = (index, value, min, max) => {
    setTimeout(() => {
      let numValue = parseInt(value) || 0;
      const originalValue = numValue;
      
      // Auto-clamp value to valid range
      numValue = Math.max(min, Math.min(max, numValue));
      
      // Update state
      const newInputs = [...this.state.transactionInputs];
      newInputs[index] = numValue;
      
      // Show auto-correction feedback if value was clamped
      let autoCorrectIndex = -1;
      if (originalValue !== numValue && value !== '' && value !== '0') {
        autoCorrectIndex = index;
        setTimeout(() => this.setState({ autoCorrectedIndex: -1 }), 1000);
      }
      
      this.setState({ 
        transactionInputs: newInputs,
        autoCorrectedIndex: autoCorrectIndex
      });
    }, 1700);
  };

  handleInputPaste = (index, e, min, max) => {
    setTimeout(() => {
      const input = e.target;
      const value = parseInt(input.value) || 0;
      const clampedValue = Math.max(min, Math.min(max, value));
      
      if (value !== clampedValue) {
        this.handleInputChange(index, clampedValue.toString(), min, max);
      }
    }, 10);
  };

  parseTransactionRange(range) {
    const cleanRange = range.trim();
    
    if (cleanRange.includes('+')) {
      // Handle "250+" format
      const min = parseInt(cleanRange.replace('+', ''), 10);
      const max = min + 250; // reasonable assumption for calculation
      return (min + max) / 2;
    } else if (cleanRange.includes('-')) {
      // Handle "1-100" format
      const parts = cleanRange.split('-');
      if (parts.length >= 2) {
        const min = parseInt(parts[0].trim(), 10);
        const max = parseInt(parts[1].trim(), 10);
        return (min + max) / 2;
      }
    }
    
    return parseInt(cleanRange, 10) || 0; // single number
  }

  getRangeLimits(range) {
    const cleanRange = range.trim();
    
    if (cleanRange.includes('+')) {
      // Handle "250+" format
      const min = parseInt(cleanRange.replace('+', ''), 10);
      const max = min + 500; // reasonable upper limit for "+" ranges
      return { min, max };
    } else if (cleanRange.includes('-')) {
      // Handle "1-100" format
      const parts = cleanRange.split('-');
      if (parts.length >= 2) {
        const min = parseInt(parts[0].trim(), 10);
        const max = parseInt(parts[1].trim(), 10);
        return { min, max };
      }
    }
    
    // Single number - allow some flexibility around it
    const single = parseInt(cleanRange, 10) || 0;
    return { min: Math.max(1, single - 10), max: single + 10 };
  }

  parseFeeAmount(feeString) {
    // Extract numeric value from fee string like "$3.50"
    const numeric = feeString.replace(/[^0-9.]/g, '');
    return parseFloat(numeric) || 0;
  }

  calculateIncome(transactionCount, fee, yourSharePercent) {
    return transactionCount * fee * (yourSharePercent / 100);
  }

  formatCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString();
  }

  render() {
    const {
      fee_amount = '$3.50',
      income_title = 'INCOME EXPECTATIONS @ {fee_amount} FEE',
      enable_row_1 = 'on',
      enable_row_2 = 'on',
      enable_row_3 = 'on',
      enable_row_4 = 'on',
      enable_row_5 = 'on',
      range_1 = '1-100',
      range_2 = '100-150', 
      range_3 = '150-250',
      range_4 = '250+',
      range_5 = '300+',
      our_share_1 = '25',
      our_share_2 = '30',
      our_share_3 = '35', 
      our_share_4 = '50',
      our_share_5 = '60',
      table_bg_color,
      header_bg_color,
      header_text_color,
      content_bg_color,
      content_text_color,
      highlight_column = 'on',
      highlight_color = '#4a69bd'
    } = this.props;

    const fee = this.parseFeeAmount(fee_amount);
    
    // Process income title with placeholder replacement
    const processedIncomeTitle = income_title.replace('{fee_amount}', fee_amount);
    
    // Build table data
    const rows = [];
    const ranges = [range_1, range_2, range_3, range_4, range_5];
    const ourShares = [our_share_1, our_share_2, our_share_3, our_share_4, our_share_5];
    const enabledRows = [enable_row_1, enable_row_2, enable_row_3, enable_row_4, enable_row_5];
    
    let displayIndex = 0; // Track actual display index for state management
    for (let i = 0; i < 5; i++) {
      if (enabledRows[i] === 'on') {
        const range = ranges[i];
        const ourShare = parseInt(ourShares[i], 10);
        const yourShare = 100 - ourShare;
        
        const defaultTransactionCount = this.parseTransactionRange(range);
        const actualTransactionCount = this.state.transactionInputs[displayIndex] || defaultTransactionCount;
        const income = this.calculateIncome(actualTransactionCount, fee, yourShare);
        
        rows.push({
          range: range,
          ourShare: ourShare + '%',
          yourShare: yourShare + '%',
          income: this.formatCurrency(income),
          transactionCount: defaultTransactionCount, // Default for initial display
          actualTransactionCount: actualTransactionCount,
          originalIndex: i, // Keep track of original row index
          displayIndex: displayIndex // Index in the displayed rows
        });
        
        displayIndex++;
      }
    }

    // Generate styles
    const tableStyle = {};
    if (table_bg_color) {
      tableStyle.backgroundColor = table_bg_color;
    }

    const headerStyle = {};
    if (header_bg_color) {
      headerStyle.backgroundColor = header_bg_color;
    }
    if (header_text_color) {
      headerStyle.color = header_text_color;
    }

    const contentStyle = {};
    if (content_bg_color) {
      contentStyle.backgroundColor = content_bg_color;
    }
    if (content_text_color) {
      contentStyle.color = content_text_color;
    }

    const highlightStyle = {};
    if (highlight_column === 'on' && highlight_color) {
      highlightStyle.backgroundColor = highlight_color;
      highlightStyle.color = 'white';
    }

    const tableClasses = ['dicm-income-table'];
    if (highlight_column === 'on') {
      tableClasses.push('dicm-highlight-column');
    }

    return (
      <div className="dicm-income-calculator-wrapper">
        <table className={tableClasses.join(' ')} style={tableStyle}>
          <thead>
            <tr>
              <th className="dicm-transactions-header" style={headerStyle}>
                TRANSACTIONS
              </th>
              <th className="dicm-our-share-header" style={headerStyle}>
                OUR SHARE
              </th>
              <th className="dicm-your-share-header" style={headerStyle}>
                YOUR SHARE
              </th>
              <th className="dicm-income-header" style={headerStyle}>
                {processedIncomeTitle}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const rangeLimits = this.getRangeLimits(ranges[row.originalIndex]);
              const inputValue = this.state.transactionInputs[row.displayIndex] || row.transactionCount;
              const isAutoCorrected = this.state.autoCorrectedIndex === row.displayIndex;
              
              return (
                <tr key={row.originalIndex}>
                  <td className="dicm-transactions-cell" style={contentStyle}>
                    <span className="dicm-range-label">{row.range}</span>
                    <input 
                      type="number" 
                      className={`dicm-transaction-input ${isAutoCorrected ? 'dicm-auto-corrected' : ''}`}
                      value={inputValue}
                      min={rangeLimits.min}
                      max={rangeLimits.max}
                      // onChange={(e) => this.handleInputChange(row.displayIndex, e.target.value, rangeLimits.min, rangeLimits.max)}
                      onPaste={(e) => this.handleInputPaste(row.displayIndex, e, rangeLimits.min, rangeLimits.max)}
                      title={`Enter between ${rangeLimits.min} and ${rangeLimits.max} transactions`}
                      placeholder="Enter transactions"
                      style={{
                        width: '80px',
                        padding: '4px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        marginLeft: '8px'
                      }}
                    />
                  </td>
                  <td className="dicm-your-share-cell" style={contentStyle}>
                    {row.yourShare}
                  </td>
                  <td className="dicm-our-share-cell" style={contentStyle}>
                    {row.ourShare}
                  </td>
                  <td className="dicm-income-cell" style={contentStyle}>
                    {row.income}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default IncomeCalculator;
