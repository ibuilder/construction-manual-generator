/**
 * JavaScript for form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the form page
    if (!document.getElementById('manualForm')) return;
    
    // Set up form validation
    setupFormValidation();
});

/**
 * Set up form validation
 */
function setupFormValidation() {
    const form = document.getElementById('manualForm');
    
    // Handle form submission
    form.addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();
        event.stopPropagation();
        
        // Add validation class to the form
        form.classList.add('was-validated');
        
        // Check if the form is valid
        if (form.checkValidity()) {
            // If form is valid, call the submit function from form.js
            submitForm();
        } else {
            // If form is invalid, find the first invalid input and focus on it
            const invalidInput = form.querySelector(':invalid');
            if (invalidInput) {
                invalidInput.focus();
                
                // Find which section the invalid input is in
                const invalidSection = invalidInput.closest('.form-section');
                if (invalidSection) {
                    // Get the index of the section
                    const sections = Array.from(document.querySelectorAll('.form-section'));
                    const sectionIndex = sections.indexOf(invalidSection);
                    
                    if (sectionIndex !== -1) {
                        // Navigate to that section
                        goToSection(sectionIndex);
                    }
                }
            }
        }
    });
    
    // Add event listeners for input validation
    setupInputValidation();
}

/**
 * Set up input validation
 */
function setupInputValidation() {
    const form = document.getElementById('manualForm');
    
    // Get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add event listeners to all inputs
    inputs.forEach(input => {
        // Validate on blur (when the input loses focus)
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        // Validate on input (when the value changes)
        input.addEventListener('input', function() {
            validateInput(this);
        });
    });
}

/**
 * Validate a single input
 * @param {HTMLElement} input - The input element to validate
 */
function validateInput(input) {
    // Check if the input is required and empty
    if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else if (input.value.trim()) {
        // Input has a value, validate against any patterns or other constraints
        if (input.checkValidity()) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
        }
    } else {
        // Input is not required and empty, remove validation classes
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
    }
}

/**
 * Custom validation rules for specific inputs
 * @param {HTMLElement} input - The input element to validate
 * @returns {boolean} - Whether the input is valid
 */
function customValidation(input) {
    // Implement any custom validation rules here
    
    // Example: Validate phone numbers
    if (input.type === 'tel') {
        const phonePattern = /^[\d\+\-\(\) ]+$/;
        return phonePattern.test(input.value);
    }
    
    // Example: Validate email
    if (input.type === 'email') {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(input.value);
    }
    
    // Default to true if no custom validation is needed
    return true;
}

/**
 * Validate a specific section of the form
 * @param {number} sectionIndex - The index of the section to validate
 * @returns {boolean} - Whether the section is valid
 */
function validateSection(sectionIndex) {
    // Get all form sections
    const sections = document.querySelectorAll('.form-section');
    
    // Make sure the index is valid
    if (sectionIndex < 0 || sectionIndex >= sections.length) {
        return false;
    }
    
    // Get the current section
    const section = sections[sectionIndex];
    
    // Get all required inputs in this section
    const requiredInputs = section.querySelectorAll('[required]');
    
    // Check if all required inputs are valid
    let isValid = true;
    
    requiredInputs.forEach(input => {
        // Check basic validation
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            // Check any custom validation
            const customValid = customValidation(input);
            
            if (!customValid) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        }
    });
    
    return isValid;
}