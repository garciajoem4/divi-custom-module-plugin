// External Dependencies
import { Component } from 'react';

// Internal Dependencies
import './style.css';

class CustomTable extends Component {

  static slug = 'dicm_custom_table';

  render() {
    const {
      columns = 3,
      rows = 3,
      include_header = 'on',
      table_font_family,
      table_borders,
      header_bg_color,
      header_font_size,
      header_font_color,
      header_font_weight,
      content_font_weight,
      header_padding,
      cell_padding
    } = this.props;

    const colCount = parseInt(columns, 10) || 3;
    const rowCount = parseInt(rows, 10) || 3;

    // Table-wide styles
    const tableStyle = {};
    if (table_font_family) {
      tableStyle.fontFamily = table_font_family;
    }

    // Table classes
    const tableClasses = ['dicm-custom-table'];
    if (table_borders === 'off') {
      tableClasses.push('dicm-no-borders');
    }

    // Get individual column header styles
    const getColumnHeaderStyles = (colIndex) => {
      const colNum = colIndex + 1;
      const styles = {};
      
      // Individual column header styles (priority)
      if (this.props[`header_col_${colNum}_bg_color`]) {
        styles.backgroundColor = this.props[`header_col_${colNum}_bg_color`];
      } else if (header_bg_color) {
        styles.backgroundColor = header_bg_color;
      }
      
      if (this.props[`header_col_${colNum}_font_color`]) {
        styles.color = this.props[`header_col_${colNum}_font_color`];
      } else if (header_font_color) {
        styles.color = header_font_color;
      }

      // General header styles
      if (header_font_size) {
        styles.fontSize = header_font_size;
      }

      if (header_font_weight) {
        styles.fontWeight = header_font_weight;
      }

      // Custom padding
      if (header_padding) {
        styles.padding = header_padding;
      }
      
      return styles;
    };

    // Get column styles for body cells
    const getColumnStyles = (colIndex) => {
      const colNum = colIndex + 1;
      const styles = {};

      if (this.props[`col_${colNum}_bg_color`]) {
        styles.backgroundColor = this.props[`col_${colNum}_bg_color`];
      }
      if (this.props[`col_${colNum}_font_size`]) {
        styles.fontSize = this.props[`col_${colNum}_font_size`];
      }
      if (this.props[`col_${colNum}_font_color`]) {
        styles.color = this.props[`col_${colNum}_font_color`];
      }

      // General content font weight
      if (content_font_weight) {
        styles.fontWeight = content_font_weight;
      }

      // Custom padding
      if (cell_padding) {
        styles.padding = cell_padding;
      }

      return styles;
    };

    // Render table headers
    const renderHeaders = () => {
      const headers = [];
      for (let col = 0; col < colCount; col++) {
        const headerContent = this.props[`header_${col + 1}`] || `Header ${col + 1}`;
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
      for (let row = 0; row < rowCount; row++) {
        const cells = [];
        for (let col = 0; col < colCount; col++) {
          const cellContent = this.props[`cell_${row + 1}_${col + 1}`] || `Cell ${row + 1}-${col + 1}`;
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
      <div className="dicm-custom-table-wrapper">
        <table className={tableClasses.join(' ')} style={tableStyle}>
          {include_header === 'on' && (
            <thead>
              <tr>
                {renderHeaders()}
              </tr>
            </thead>
          )}
          <tbody>
            {renderRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default CustomTable;
