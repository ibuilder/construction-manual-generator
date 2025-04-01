/**
 * JavaScript for handling the multi-step form
 */

// Current form section index
let currentSection = 0;
// Total number of form sections
let totalSections = 0;

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the form page
    if (!document.getElementById('manualForm')) return;
    
    // Initialize the form
    initFormNavigation();
    setupFormControls();
    handleFileUploadControls();
    
    // Check if we need to load a saved project
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    
    if (projectId) {
        loadProject(projectId);
    }
});

/**
 * Initialize the form navigation
 */
function initFormNavigation() {
    // Get all form sections
    const formSections = document.querySelectorAll('.form-section');
    totalSections = formSections.length;
    
    // Get navigation buttons
    const nextButtons = document.querySelectorAll('.next');
    const prevButtons = document.querySelectorAll('.previous');
    const submitButtons = document.querySelectorAll('.submit');
    
    // Add event listeners to next buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Validate the current section before proceeding
            if (validateSection(currentSection)) {
                goToSection(currentSection + 1);
            }
        });
    });
    
    // Add event listeners to previous buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToSection(currentSection - 1);
        });
    });
    
    // Add event listeners to submit buttons
    submitButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateSection(currentSection)) {
                submitForm();
            }
        });
    });
    
    // Update the UI for the initial section
    updateFormUI();
}

/**
 * Navigate to a specific form section
 * @param {number} sectionIndex - Index of the section to navigate to
 */
function goToSection(sectionIndex) {
    // Make sure the index is valid
    if (sectionIndex < 0 || sectionIndex >= totalSections) {
        return;
    }
    
    // Hide current section
    const formSections = document.querySelectorAll('.form-section');
    formSections[currentSection].style.display = 'none';
    
    // Show new section
    formSections[sectionIndex].style.display = 'block';
    
    // Update current section index
    currentSection = sectionIndex;
    
    // Update UI
    updateFormUI();
    
    // Scroll to top of the form
    window.scrollTo({ top: document.getElementById('manualForm').offsetTop - 50, behavior: 'smooth' });
}

/**
 * Update the form UI based on current section
 */
function updateFormUI() {
    // Get navigation buttons
    const prevButtons = document.querySelectorAll('.previous');
    const nextButtons = document.querySelectorAll('.next');
    const submitButtons = document.querySelectorAll('.submit');
    
    // Update button visibility
    prevButtons.forEach(button => {
        button.style.display = currentSection > 0 ? 'block' : 'none';
    });
    
    nextButtons.forEach(button => {
        button.style.display = currentSection < totalSections - 1 ? 'block' : 'none';
    });
    
    submitButtons.forEach(button => {
        button.style.display = currentSection === totalSections - 1 ? 'block' : 'none';
    });
    
    // Update progress bar
    const progressPercentage = ((currentSection + 1) / totalSections) * 100;
    const progressBar = document.getElementById('formProgress');
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.setAttribute('aria-valuenow', progressPercentage);
}

/**
 * Validate the current form section
 * @param {number} sectionIndex - Index of the section to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateSection(sectionIndex) {
    // Get the current section
    const formSections = document.querySelectorAll('.form-section');
    const currentSectionEl = formSections[sectionIndex];
    
    // Get all required inputs in this section
    const requiredInputs = currentSectionEl.querySelectorAll('[required]');
    
    // Check if all required inputs are filled
    let valid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            valid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return valid;
}

/**
 * Setup additional form controls
 */
function setupFormControls() {
    // Add staff member button
    const addStaffButton = document.getElementById('addStaffMember');
    if (addStaffButton) {
        addStaffButton.addEventListener('click', addNewStaffMember);
    }
    
    // Save project buttons
    const saveProjectButtons = document.querySelectorAll('#saveProject, #saveProjectBottom');
    saveProjectButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Show save modal
            const saveModal = new bootstrap.Modal(document.getElementById('saveProjectModal'));
            saveModal.show();
        });
    });
    
    // Confirm save button
    const confirmSaveButton = document.getElementById('confirmSaveProject');
    if (confirmSaveButton) {
        confirmSaveButton.addEventListener('click', saveProject);
    }
}

/**
 * Add a new staff member row to the table
 */
function addNewStaffMember() {
    const staffTable = document.querySelector('#addStaffMember').closest('.card-body').querySelector('tbody');
    
    // Create new row
    const newRow = document.createElement('tr');
    
    // Create title cell
    const titleCell = document.createElement('td');
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'form-control';
    titleInput.name = 'additionalStaffTitle[]';
    titleInput.placeholder = 'Staff Title';
    titleCell.appendChild(titleInput);
    
    // Create name cell
    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'form-control';
    nameInput.name = 'additionalStaffName[]';
    nameInput.placeholder = 'Staff Name';
    nameCell.appendChild(nameInput);
    
    // Append cells to row
    newRow.appendChild(titleCell);
    newRow.appendChild(nameCell);
    
    // Append row to table
    staffTable.appendChild(newRow);
}

/**
 * Handle file upload control visibility
 */
function handleFileUploadControls() {
    // Map checkbox toggle
    const includeMapCheckbox = document.getElementById('includeMap');
    const mapUploadSection = document.getElementById('mapUploadSection');
    
    if (includeMapCheckbox && mapUploadSection) {
        includeMapCheckbox.addEventListener('change', function() {
            mapUploadSection.style.display = this.checked ? 'block' : 'none';
        });
    }
}

/**
 * Submit the form and generate the manual
 */
function submitForm() {
    const form = document.getElementById('manualForm');
    
    // Check if the form is valid
    if (!form.checkValidity()) {
        // Trigger HTML5 validation
        const event = new Event('submit', { cancelable: true });
        form.dispatchEvent(event);
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    
    // Convert FormData to a regular object
    const manualData = {};
    for (const [key, value] of formData.entries()) {
        if (key.endsWith('[]')) {
            // Handle array inputs
            const arrayKey = key.slice(0, -2);
            if (!manualData[arrayKey]) {
                manualData[arrayKey] = [];
            }
            manualData[arrayKey].push(value);
        } else {
            manualData[key] = value;
        }
    }
    
    // Handle file uploads
    const mapUpload = document.getElementById('mapUpload');
    const logoUpload = document.getElementById('customLogo');
    
    const filePromises = [];
    
    if (mapUpload && mapUpload.files.length > 0) {
        filePromises.push(readFileAsDataURL(mapUpload.files[0]).then(dataUrl => {
            manualData.mapImage = dataUrl;
        }));
    }
    
    if (logoUpload && logoUpload.files.length > 0) {
        filePromises.push(readFileAsDataURL(logoUpload.files[0]).then(dataUrl => {
            manualData.logoImage = dataUrl;
        }));
    }
    
    // Once all files are processed, generate the manual
    Promise.all(filePromises).then(() => {
        // Save the data to session storage for the preview page
        sessionStorage.setItem('manualData', JSON.stringify(manualData));
        
        // Redirect to the preview page
        window.location.href = 'preview.html';
    });
}

/**
 * Read a file as Data URL
 * @param {File} file - The file to read
 * @returns {Promise<string>} - Promise resolving to the Data URL
 */
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            resolve(reader.result);
        };
        
        reader.onerror = () => {
            reject(reader.error);
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * Save the current project state
 */
function saveProject() {
    const form = document.getElementById('manualForm');
    const projectNameInput = document.getElementById('projectSaveName');
    const projectName = projectNameInput.value.trim();
    
    if (!projectName) {
        alert('Please enter a name for your project.');
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    
    // Convert FormData to a plain object
    const projectData = {};
    for (const [key, value] of formData.entries()) {
        if (key.endsWith('[]')) {
            // Handle array inputs
            const arrayKey = key.slice(0, -2);
            if (!projectData[arrayKey]) {
                projectData[arrayKey] = [];
            }
            projectData[arrayKey].push(value);
        } else {
            projectData[key] = value;
        }
    }
    
    // Get existing saved projects
    let savedProjects = JSON.parse(localStorage.getItem('constructionManualProjects') || '[]');
    
    // Generate project ID or use existing one
    const savedDataId = document.getElementById('savedDataId').value || generateUniqueId();
    
    // Check if this project already exists
    const existingIndex = savedProjects.findIndex(project => project.id === savedDataId);
    
    // Create project object
    const project = {
        id: savedDataId,
        name: projectName,
        data: projectData,
        savedDate: new Date().toISOString()
    };
    
    // Update or add the project
    if (existingIndex !== -1) {
        savedProjects[existingIndex] = project;
    } else {
        savedProjects.push(project);
    }
    
    // Save back to localStorage
    localStorage.setItem('constructionManualProjects', JSON.stringify(savedProjects));
    
    // Update the form's saved data ID
    document.getElementById('savedDataId').value = savedDataId;
    
    // Close the modal
    bootstrap.Modal.getInstance(document.getElementById('saveProjectModal')).hide();
    
    // Show success message
    alert('Project saved successfully!');
}

/**
 * Load a saved project
 * @param {string} projectId - ID of the project to load
 */
function loadProject(projectId) {
    // Get saved projects
    const savedProjects = JSON.parse(localStorage.getItem('constructionManualProjects') || '[]');
    
    // Find the project with the given ID
    const project = savedProjects.find(p => p.id === projectId);
    
    if (!project) {
        alert('Project not found!');
        return;
    }
    
    // Set the saved data ID
    document.getElementById('savedDataId').value = project.id;
    
    // Fill in the form with saved data
    const form = document.getElementById('manualForm');
    
    // Clear any existing form data
    form.reset();
    
    // Fill in the data
    const data = project.data;
    
    for (const key in data) {
        const input = form.querySelector(`[name="${key}"]`);
        
        if (input) {
            // Handle different input types
            if (input.type === 'checkbox') {
                input.checked = data[key] === 'on';
            } else {
                input.value = data[key];
            }
        }
    }
    
    // Handle array inputs like additional staff members
    if (data.additionalStaffTitle && Array.isArray(data.additionalStaffTitle)) {
        for (let i = 0; i < data.additionalStaffTitle.length; i++) {
            // Add a new row for each additional staff member
            addNewStaffMember();
            
            // Fill in the values
            const titleInputs = form.querySelectorAll('[name="additionalStaffTitle[]"]');
            const nameInputs = form.querySelectorAll('[name="additionalStaffName[]"]');
            
            if (titleInputs[i] && data.additionalStaffTitle[i]) {
                titleInputs[i].value = data.additionalStaffTitle[i];
            }
            
            if (nameInputs[i] && data.additionalStaffName && data.additionalStaffName[i]) {
                nameInputs[i].value = data.additionalStaffName[i];
            }
        }
    }
    
    // Trigger any dependent UI updates
    if (document.getElementById('includeMap')) {
        document.getElementById('includeMap').dispatchEvent(new Event('change'));
    }
    
    // Show a success message
    alert(`Project "${project.name}" loaded successfully!`);
}