// Frontend JavaScript for Divi Custom Modules

// AWeber Form fixes for Safari
if (typeof window !== 'undefined') {
  // Safari form compatibility fixes
  document.addEventListener('DOMContentLoaded', function() {
    // Fix AWeber forms in Safari
    const aweberForms = document.querySelectorAll('.aweber-form, .dicm-aweber-form');
    
    aweberForms.forEach(function(form) {
      // Add Safari-specific classes
      if (navigator.userAgent.indexOf('Safari') > -1 && navigator.userAgent.indexOf('Chrome') === -1) {
        form.classList.add('safari-compatible');
      }
      
      // Ensure proper form styling
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(function(input) {
        input.style.webkitAppearance = 'none';
        input.style.borderRadius = '4px';
      });
    });
    
    // Custom table responsive handling
    const customTables = document.querySelectorAll('.dicm-custom-table');
    
    customTables.forEach(function(tableContainer) {
      const table = tableContainer.querySelector('table');
      if (table && window.innerWidth <= 480) {
        // Add data labels for mobile stacking
        const headers = table.querySelectorAll('th');
        const cells = table.querySelectorAll('td');
        
        cells.forEach(function(cell, index) {
          const headerIndex = index % headers.length;
          if (headers[headerIndex]) {
            cell.setAttribute('data-label', headers[headerIndex].textContent);
          }
        });
      }
    });
  });
  
  // Handle window resize for responsive tables
  window.addEventListener('resize', function() {
    const customTables = document.querySelectorAll('.dicm-custom-table');
    
    customTables.forEach(function(tableContainer) {
      const table = tableContainer.querySelector('table');
      if (table) {
        const headers = table.querySelectorAll('th');
        const cells = table.querySelectorAll('td');
        
        if (window.innerWidth <= 480) {
          cells.forEach(function(cell, index) {
            const headerIndex = index % headers.length;
            if (headers[headerIndex]) {
              cell.setAttribute('data-label', headers[headerIndex].textContent);
            }
          });
        } else {
          cells.forEach(function(cell) {
            cell.removeAttribute('data-label');
          });
        }
      }
    });
  });
}
