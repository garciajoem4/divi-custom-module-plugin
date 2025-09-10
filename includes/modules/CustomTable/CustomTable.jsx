// External Dependencies
import { Component } from 'react';

// Internal Dependencies
import './style.css';

class CustomTable extends Component {

  static slug = 'dicm_custom_table';

  render() {
    const {
      table_columns,
      table_rows,
      table_style,
      header_bg_color,
      header_font_family,
      header_font_size,
      header_font_color,
      header_font_weight
    } = this.props;

    const columns = parseInt(table_columns) || 3;
    const rows = parseInt(table_rows) || 3;

    // General header styles (fallback)
    const generalHeaderStyles = {
      backgroundColor: header_bg_color || '#f8f9fa',
      fontFamily: header_font_family || 'inherit',
      fontSize: header_font_size || '16px',
      color: header_font_color || '#333333',
      fontWeight: header_font_weight || '600'
    };

    // Get individual column header styles
    const getColumnHeaderStyles = (colIndex) => {
      const colNum = colIndex + 1;
      const individualStyles = {};
      
      // Use individual column header styles if available, otherwise fall back to general
      if (this.props[`header_col_${colNum}_bg_color`]) {
        individualStyles.backgroundColor = this.props[`header_col_${colNum}_bg_color`];
      } else if (generalHeaderStyles.backgroundColor) {
        individualStyles.backgroundColor = generalHeaderStyles.backgroundColor;
      }
      
      if (this.props[`header_col_${colNum}_font_family`]) {
        individualStyles.fontFamily = this.props[`header_col_${colNum}_font_family`];
      } else if (generalHeaderStyles.fontFamily) {
        individualStyles.fontFamily = generalHeaderStyles.fontFamily;
      }
      
      if (this.props[`header_col_${colNum}_font_size`]) {
        individualStyles.fontSize = this.props[`header_col_${colNum}_font_size`];
      } else if (generalHeaderStyles.fontSize) {
        individualStyles.fontSize = generalHeaderStyles.fontSize;
      }
      
      if (this.props[`header_col_${colNum}_font_color`]) {
        individualStyles.color = this.props[`header_col_${colNum}_font_color`];
      } else if (generalHeaderStyles.color) {
        individualStyles.color = generalHeaderStyles.color;
      }
      
      if (this.props[`header_col_${colNum}_font_weight`]) {
        individualStyles.fontWeight = this.props[`header_col_${colNum}_font_weight`];
      } else if (generalHeaderStyles.fontWeight) {
        individualStyles.fontWeight = generalHeaderStyles.fontWeight;
      }
      
      return individualStyles;
    };

    // Get column styles for body cells
    const getColumnStyles = (colIndex) => {
      const colNum = colIndex + 1;
      return {
        backgroundColor: this.props[`col_${colNum}_bg_color`] || '#ffffff',
        fontFamily: this.props[`col_${colNum}_font_family`] || 'inherit',
        fontSize: this.props[`col_${colNum}_font_size`] || '14px',
        color: this.props[`col_${colNum}_font_color`] || '#333333',
        fontWeight: this.props[`col_${colNum}_font_weight`] || '400'
      };
    };

    // Render table headers
    const renderHeaders = () => {
      const headers = [];
      for (let col = 0; col < columns; col++) {
        const headerContent = this.props[`header_col_${col + 1}`] || `Header ${col + 1}`;
        const headerStyles = getColumnHeaderStyles(col);
        headers.push(
          <th key={col} style={headerStyles} className="dicm-table-header">
            {headerContent}
          </th>
        );
      }
      return headers;
    };

    // Render table rows
    const renderRows = () => {
      const tableRows = [];
      for (let row = 0; row < rows; row++) {
        const cells = [];
        for (let col = 0; col < columns; col++) {
          const cellContent = this.props[`row_${row + 1}_col_${col + 1}`] || `Row ${row + 1}, Col ${col + 1}`;
          const colStyles = getColumnStyles(col);
          cells.push(
            <td key={col} style={colStyles} className="dicm-table-cell">
              {cellContent}
            </td>
          );
        }
        tableRows.push(<tr key={row}>{cells}</tr>);
      }
      return tableRows;
    };

    return (
      <div className={`dicm-custom-table dicm-table-${table_style || 'default'}`}>
        <table>
          <thead>
            <tr>
              {renderHeaders()}
            </tr>
          </thead>
          <tbody>
            {renderRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default CustomTable;
