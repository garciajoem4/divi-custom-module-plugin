// Frontend JavaScript for Divi Custom Modules
import React from 'react';
import { createRoot } from 'react-dom/client';
import PopupIncomeCalculator from './modules/PopupIncomeCalculator/PopupIncomeCalculator';
import TimesheetTracker from './modules/TimesheetTracker/TimesheetTracker';

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

// TimesheetTracker React Component Initialization
// Initialize TimesheetTracker components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Find all TimesheetTracker containers
  const containers = document.querySelectorAll('.dicm-timesheet-tracker');
  
  containers.forEach(function(container) {
    // Skip if already initialized
    if (container.hasAttribute('data-initialized')) {
      return;
    }
    
    // Get configuration from data attribute
    const configData = container.getAttribute('data-config');
    let config = {};
    
    try {
      config = configData ? JSON.parse(configData) : {};
    } catch (error) {
      console.error('TimesheetTracker: Failed to parse config data:', error);
      return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create React root and render component
    const root = createRoot(container);
    root.render(React.createElement(TimesheetTracker, {
      attrs: {
        config: JSON.stringify(config)
      }
    }));
    
    // Mark as initialized
    container.setAttribute('data-initialized', 'true');
    
    console.log('TimesheetTracker: Component initialized successfully');
  });
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

// TimesheetTracker React Component Initialization
// Initialize TimesheetTracker components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Find all TimesheetTracker containers
  const containers = document.querySelectorAll('.dicm-timesheet-tracker');
  
  containers.forEach(function(container) {
    // Skip if already initialized
    if (container.hasAttribute('data-initialized')) {
      return;
    }
    
    // Get configuration from data attribute
    const configData = container.getAttribute('data-config');
    let config = {};
    
    try {
      config = configData ? JSON.parse(configData) : {};
    } catch (error) {
      console.error('TimesheetTracker: Failed to parse config data:', error);
      return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create React root and render component
    const root = createRoot(container);
    root.render(React.createElement(TimesheetTracker, {
      attrs: {
        config: JSON.stringify(config)
      }
    }));
    
    // Mark as initialized
    container.setAttribute('data-initialized', 'true');
    
    console.log('TimesheetTracker: Component initialized successfully');
  });
});


// PopupIncomeCalculator React Component Initialization
document.addEventListener("DOMContentLoaded", function() {
  // Find all PopupIncomeCalculator containers
  const containers = document.querySelectorAll(".dicm-popup-income-calculator");
  
  containers.forEach(function(container) {
    // Skip if already initialized
    if (container.hasAttribute("data-initialized")) {
      return;
    }
    
    // Get configuration from data attribute
    const configData = container.getAttribute("data-config");
    let config = {};
    
    try {
      config = configData ? JSON.parse(configData) : {};
    } catch (error) {
      console.error("PopupIncomeCalculator: Failed to parse config data:", error);
      return;
    }
    
    // Clear existing content
    container.innerHTML = "";
    
    // Create React root and render component
    const root = createRoot(container);
    root.render(React.createElement(PopupIncomeCalculator, {
      attrs: {
        config: JSON.stringify(config)
      }
    }));
    
    // Mark as initialized
    container.setAttribute("data-initialized", "true");
    
    console.log("PopupIncomeCalculator: Component initialized successfully");
  });
});
