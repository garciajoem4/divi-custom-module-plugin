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

  // Import TimesheetTracker frontend functionality
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize TimesheetTracker React components on frontend
    const timesheetTrackers = document.querySelectorAll('.dicm-timesheet-tracker');
    if (timesheetTrackers.length > 0) {
      console.log('TimesheetTracker modules detected:', timesheetTrackers.length);
      
      // Import React and TimesheetTracker component for frontend initialization
      import('./modules/TimesheetTracker/TimesheetTracker.jsx').then(({ default: TimesheetTracker }) => {
        import('react').then(React => {
          import('react-dom/client').then(ReactDOM => {
            timesheetTrackers.forEach(function(container) {
              const configData = container.getAttribute('data-config');
              let config = {};
              
              try {
                config = JSON.parse(configData || '{}');
              } catch (e) {
                console.error('Failed to parse TimesheetTracker config:', e);
              }
              
              // Clear the static HTML content and mount React component
              container.innerHTML = '<div class="timesheet-react-root"></div>';
              const root = container.querySelector('.timesheet-react-root');
              
              // Create React root and render component
              const reactRoot = ReactDOM.createRoot(root);
              reactRoot.render(React.createElement(TimesheetTracker, { attrs: { config: JSON.stringify(config) } }));
            });
          });
        });
      }).catch(error => {
        console.error('Failed to load TimesheetTracker component:', error);
        // Fallback to basic functionality without React
        initBasicTimesheetFunctionality(timesheetTrackers);
      });
    }
  });
  
  // Fallback basic functionality for when React fails to load
  function initBasicTimesheetFunctionality(containers) {
    containers.forEach(function(container) {
      // Basic timer functionality without React
      let timerSeconds = 0;
      let timerInterval = null;
      let isRunning = false;
      
      const timerDisplay = container.querySelector('.timer-time');
      const startBtn = container.querySelector('.start-btn');
      const stopBtn = container.querySelector('.stop-btn');
      const resetBtn = container.querySelector('.reset-btn');
      const addRowBtn = container.querySelector('.add-row-btn');
      
      function updateTimerDisplay() {
        if (timerDisplay) {
          const hours = Math.floor(timerSeconds / 3600);
          const minutes = Math.floor((timerSeconds % 3600) / 60);
          const seconds = timerSeconds % 60;
          timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      }
      
      if (startBtn) {
        startBtn.addEventListener('click', function() {
          if (!isRunning) {
            isRunning = true;
            startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'inline-block';
            
            timerInterval = setInterval(function() {
              timerSeconds++;
              updateTimerDisplay();
            }, 1000);
          }
        });
      }
      
      if (stopBtn) {
        stopBtn.addEventListener('click', function() {
          if (isRunning) {
            isRunning = false;
            stopBtn.style.display = 'none';
            if (startBtn) startBtn.style.display = 'inline-block';
            
            if (timerInterval) {
              clearInterval(timerInterval);
            }
          }
        });
      }
      
      if (resetBtn) {
        resetBtn.addEventListener('click', function() {
          timerSeconds = 0;
          isRunning = false;
          if (timerInterval) {
            clearInterval(timerInterval);
          }
          if (startBtn) startBtn.style.display = 'inline-block';
          if (stopBtn) stopBtn.style.display = 'none';
          updateTimerDisplay();
        });
      }
      
      if (addRowBtn) {
        addRowBtn.addEventListener('click', function() {
          const tbody = container.querySelector('.timesheet-body');
          if (tbody) {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
              <td><input type="date" class="form-input" /></td>
              <td><input type="text" class="form-input" placeholder="Project" /></td>
              <td><input type="text" class="form-input" placeholder="Tasks" /></td>
              <td><input type="text" class="form-input" placeholder="Notes" /></td>
              <td><input type="number" class="form-input" placeholder="0.00" step="0.25" /></td>
              <td><input type="number" class="form-input" placeholder="50.00" step="0.01" /></td>
              <td class="calculated-amount">$0.00</td>
              <td><button class="delete-row-btn">Delete</button></td>
            `;
            tbody.appendChild(newRow);
            
            // Add delete functionality
            const deleteBtn = newRow.querySelector('.delete-row-btn');
            if (deleteBtn) {
              deleteBtn.addEventListener('click', function() {
                newRow.remove();
              });
            }
          }
        });
      }
    });
  }
}
