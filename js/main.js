/**
 * Main JavaScript file for Construction Manual Generator
 * Handles common functionality across the application
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the index page
    if (document.getElementById('loadSaved')) {
        initializeIndexPage();
    }
    
    // Initialize tooltips
    initializeTooltips();
});

/**
 * Initialize the index page functionality
 */
function initializeIndexPage() {
    const loadSavedBtn = document.getElementById('loadSaved');
    const savedProjectsList = document.getElementById('savedProjectsList');
    
    if (loadSavedBtn) {
        loadSavedBtn.addEventListener('click', function() {
            // Show modal with saved projects
            const savedProjects = getSavedProjects();
            
            if (savedProjects && savedProjects.length > 0) {
                // Clear the list first
                savedProjectsList.innerHTML = '';
                
                // Create a list of saved projects
                const listGroup = document.createElement('div');
                listGroup.className = 'list-group';
                
                savedProjects.forEach(project => {
                    const item = document.createElement('a');
                    item.href = 'pages/form.html?project=' + encodeURIComponent(project.id);
                    item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
                    
                    const projectDetails = document.createElement('div');
                    
                    const projectName = document.createElement('h5');
                    projectName.className = 'mb-1';
                    projectName.textContent = project.name;
                    
                    const projectDate = document.createElement('small');
                    projectDate.className = 'text-muted';
                    projectDate.textContent = formatDate(new Date(project.savedDate));
                    
                    projectDetails.appendChild(projectName);
                    projectDetails.appendChild(projectDate);
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn btn-sm btn-outline-danger';
                    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                    deleteBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (confirm('Are you sure you want to delete this project?')) {
                            deleteProject(project.id);
                            item.remove();
                            
                            // If no more projects, show the empty message
                            if (savedProjectsList.querySelectorAll('.list-group-item').length === 0) {
                                savedProjectsList.innerHTML = '<p class="text-center">No saved projects found.</p>';
                            }
                        }
                    });
                    
                    item.appendChild(projectDetails);
                    item.appendChild(deleteBtn);
                    
                    listGroup.appendChild(item);
                });
                
                savedProjectsList.appendChild(listGroup);
            } else {
                savedProjectsList.innerHTML = '<p class="text-center">No saved projects found.</p>';
            }
            
            // Show the modal
            const loadProjectModal = new bootstrap.Modal(document.getElementById('loadProjectModal'));
            loadProjectModal.show();
        });
    }
}

/**
 * Get list of saved projects from local storage
 * @returns {Array} Array of saved projects
 */
function getSavedProjects() {
    const savedProjects = localStorage.getItem('constructionManualProjects');
    return savedProjects ? JSON.parse(savedProjects) : [];
}

/**
 * Delete a project from local storage
 * @param {string} projectId - ID of the project to delete
 */
function deleteProject(projectId) {
    let savedProjects = getSavedProjects();
    savedProjects = savedProjects.filter(project => project.id !== projectId);
    localStorage.setItem('constructionManualProjects', JSON.stringify(savedProjects));
}

/**
 * Format a date to a readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Show an alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type (success, danger, warning, info)
 * @param {Element} container - Container element to append the alert to
 * @param {number} [timeout=3000] - Time in ms before the alert disappears
 */
function showAlert(message, type, container, timeout = 3000) {
    const alertEl = document.createElement('div');
    alertEl.className = `alert alert-${type} alert-dismissible fade show`;
    alertEl.setAttribute('role', 'alert');
    
    alertEl.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    container.prepend(alertEl);
    
    if (timeout) {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alertEl);
            bsAlert.close();
        }, timeout);
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} unsafe - Unsafe string that might contain HTML
 * @returns {string} Safe string with HTML escaped
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}