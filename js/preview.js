/**
 * JavaScript for the preview page
 * Handles loading and displaying the manual preview
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only run this code on the preview page
    if (!document.getElementById('manualContent')) return;
    
    // Get manual data from session storage
    const manualDataString = sessionStorage.getItem('manualData');
    
    if (!manualDataString) {
        // If no data found, show error message
        document.getElementById('manualContent').innerHTML = `
            <div class="alert alert-danger">
                <h4 class="alert-heading">Error</h4>
                <p>No manual data found. Please return to the form and generate a manual.</p>
                <hr>
                <p class="mb-0">
                    <a href="form.html" class="btn btn-primary">Return to Form</a>
                </p>
            </div>
        `;
        return;
    }
    
    // Parse the manual data
    const manualData = JSON.parse(manualDataString);
    
    // Generate the manual HTML
    generateManualPreview(manualData);
    
    // Set up button event listeners
    setupPreviewButtons(manualData);
});

/**
 * Generate and display the manual preview
 * @param {Object} data - Manual data
 */
function generateManualPreview(data) {
    // Get the manual container
    const manualContainer = document.getElementById('manualContent');
    
    // Process the data to generate the HTML content
    const manualHtml = processManualData(data);
    
    // Display the HTML content
    manualContainer.innerHTML = manualHtml;
    
    // Also save the HTML to the PDF template element
    document.getElementById('pdfTemplate').innerHTML = manualHtml;
}

/**
 * Set up the preview page buttons
 * @param {Object} data - Manual data
 */
function setupPreviewButtons(data) {
    // Export to PDF button
    const exportPdfButton = document.getElementById('exportPDF');
    if (exportPdfButton) {
        exportPdfButton.addEventListener('click', function() {
            exportToPdf(data.projectTitle || 'Construction-Manual');
        });
    }
    
    // Print button
    const printButton = document.getElementById('printManual');
    if (printButton) {
        printButton.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Edit button
    const editButton = document.getElementById('editManual');
    if (editButton) {
        editButton.addEventListener('click', function() {
            // Navigate back to the form page
            window.location.href = 'form.html';
        });
    }
    
    // Save button
    const saveButton = document.getElementById('saveManual');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            showSaveDialog(data);
        });
    }
}

/**
 * Show dialog to save the manual
 * @param {Object} data - Manual data
 */
function showSaveDialog(data) {
    // Create a modal for saving
    const modalHtml = `
        <div class="modal fade" id="saveManualModal" tabindex="-1" aria-labelledby="saveManualModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="saveManualModalLabel">Save Manual</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="manualSaveName" class="form-label">Manual Name</label>
                            <input type="text" class="form-control" id="manualSaveName" value="${data.projectTitle || 'Construction Manual'}" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmSaveManual">Save</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add the modal to the document
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Show the modal
    const saveModal = new bootstrap.Modal(document.getElementById('saveManualModal'));
    saveModal.show();
    
    // Confirm save button
    document.getElementById('confirmSaveManual').addEventListener('click', function() {
        const manualName = document.getElementById('manualSaveName').value.trim() || data.projectTitle || 'Construction Manual';
        
        // Save the manual data
        const savedId = saveManualData(manualName, data);
        
        // Close the modal
        saveModal.hide();
        
        // Show success message
        alert(`Manual "${manualName}" has been saved successfully.`);
        
        // Remove the modal from the DOM after hiding
        saveModal._element.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalContainer);
        });
    });
}