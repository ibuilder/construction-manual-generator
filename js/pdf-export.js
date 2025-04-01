/**
 * JavaScript for PDF export functionality
 * Uses html2pdf.js library to convert HTML to PDF
 */

/**
 * Export the manual to PDF
 * @param {string} filename - Name for the PDF file
 */
function exportToPdf(filename) {
    // Show a loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'position-fixed w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75';
    loadingIndicator.style.top = '0';
    loadingIndicator.style.left = '0';
    loadingIndicator.style.zIndex = '9999';
    loadingIndicator.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Generating PDF...</p>
        </div>
    `;
    document.body.appendChild(loadingIndicator);
    
    // Get the template element
    const element = document.getElementById('pdfTemplate');
    
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true);
    
    // Apply specific styling for PDF export
    const pdfStyles = `
        <style>
            body {
                font-size: 12pt;
                line-height: 1.5;
                color: #000;
            }
            
            .manual-section {
                margin-bottom: 2rem;
                page-break-inside: avoid;
            }
            
            .manual-section-title {
                font-size: 18pt;
                font-weight: bold;
                margin-bottom: 1rem;
                color: #000;
                border-bottom: 1px solid #000;
                padding-bottom: 0.5rem;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1rem;
            }
            
            table, th, td {
                border: 1px solid #000;
            }
            
            th, td {
                padding: 0.5rem;
                text-align: left;
            }
            
            th {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            
            .page-break {
                page-break-after: always;
            }
            
            img {
                max-width: 100%;
            }
            
            @page {
                margin: 1cm;
            }
            
            .table-of-contents-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }
            
            .table-of-contents-item::after {
                content: '';
                border-bottom: 1px dotted #000;
                flex: 1;
                margin: 0 0.5rem;
                margin-bottom: 0.25rem;
                align-self: flex-end;
            }
        </style>
    `;
    
    // Add the styles to the cloned element
    clonedElement.innerHTML = pdfStyles + clonedElement.innerHTML;
    
    // Set options for html2pdf
    const options = {
        margin: 10,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Generate the PDF
    html2pdf()
        .set(options)
        .from(clonedElement)
        .save()
        .then(() => {
            // Remove the loading indicator
            document.body.removeChild(loadingIndicator);
        })
        .catch(error => {
            console.error('Error generating PDF:', error);
            
            // Remove the loading indicator
            document.body.removeChild(loadingIndicator);
            
            // Show error message
            alert('An error occurred while generating the PDF. Please try again.');
        });
}

/**
 * Show PDF export options dialog
 * @param {string} filename - Name for the PDF file
 */
function showPdfExportOptions(filename) {
    // Create a modal for PDF options
    const modalHtml = `
        <div class="modal fade" id="pdfOptionsModal" tabindex="-1" aria-labelledby="pdfOptionsModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="pdfOptionsModalLabel">PDF Export Options</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="pdfFileName" class="form-label">File Name</label>
                            <input type="text" class="form-control" id="pdfFileName" value="${filename}" required>
                        </div>
                        <div class="mb-3">
                            <label for="pdfPageSize" class="form-label">Page Size</label>
                            <select class="form-select" id="pdfPageSize">
                                <option value="a4" selected>A4</option>
                                <option value="letter">Letter</option>
                                <option value="legal">Legal</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="pdfOrientation" class="form-label">Orientation</label>
                            <select class="form-select" id="pdfOrientation">
                                <option value="portrait" selected>Portrait</option>
                                <option value="landscape">Landscape</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmExportPdf">Export</button>
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
    const optionsModal = new bootstrap.Modal(document.getElementById('pdfOptionsModal'));
    optionsModal.show();
    
    // Confirm export button
    document.getElementById('confirmExportPdf').addEventListener('click', function() {
        const fileName = document.getElementById('pdfFileName').value.trim() || filename;
        const pageSize = document.getElementById('pdfPageSize').value;
        const orientation = document.getElementById('pdfOrientation').value;
        
        // Close the modal
        optionsModal.hide();
        
        // Export the PDF with the selected options
        exportToPdfWithOptions(fileName, pageSize, orientation);
        
        // Remove the modal from the DOM after hiding
        optionsModal._element.addEventListener('hidden.bs.modal', function() {
            document.body.removeChild(modalContainer);
        });
    });
}

/**
 * Export the manual to PDF with specific options
 * @param {string} filename - Name for the PDF file
 * @param {string} pageSize - Page size (a4, letter, legal)
 * @param {string} orientation - Page orientation (portrait, landscape)
 */
function exportToPdfWithOptions(filename, pageSize, orientation) {
    // Show a loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'position-fixed w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75';
    loadingIndicator.style.top = '0';
    loadingIndicator.style.left = '0';
    loadingIndicator.style.zIndex = '9999';
    loadingIndicator.innerHTML = `
        <div class="text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Generating PDF with custom settings...</p>
        </div>
    `;
    document.body.appendChild(loadingIndicator);
    
    // Get the template element
    const element = document.getElementById('pdfTemplate');
    
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true);
    
    // Apply specific styling for PDF export
    const pdfStyles = `
        <style>
            /* Same styles as in exportToPdf function */
            body {
                font-size: 12pt;
                line-height: 1.5;
                color: #000;
            }
            
            .manual-section {
                margin-bottom: 2rem;
                page-break-inside: avoid;
            }
            
            .manual-section-title {
                font-size: 18pt;
                font-weight: bold;
                margin-bottom: 1rem;
                color: #000;
                border-bottom: 1px solid #000;
                padding-bottom: 0.5rem;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 1rem;
            }
            
            table, th, td {
                border: 1px solid #000;
            }
            
            th, td {
                padding: 0.5rem;
                text-align: left;
            }
            
            th {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            
            .page-break {
                page-break-after: always;
            }
            
            img {
                max-width: 100%;
            }
            
            @page {
                margin: 1cm;
            }
            
            .table-of-contents-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
            }
            
            .table-of-contents-item::after {
                content: '';
                border-bottom: 1px dotted #000;
                flex: 1;
                margin: 0 0.5rem;
                margin-bottom: 0.25rem;
                align-self: flex-end;
            }
        </style>
    `;
    
    // Add the styles to the cloned element
    clonedElement.innerHTML = pdfStyles + clonedElement.innerHTML;
    
    // Set options for html2pdf with the custom settings
    const options = {
        margin: 10,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: pageSize, orientation: orientation }
    };
    
    // Generate the PDF
    html2pdf()
        .set(options)
        .from(clonedElement)
        .save()
        .then(() => {
            // Remove the loading indicator
            document.body.removeChild(loadingIndicator);
        })
        .catch(error => {
            console.error('Error generating PDF:', error);
            
            // Remove the loading indicator
            document.body.removeChild(loadingIndicator);
            
            // Show error message
            alert('An error occurred while generating the PDF. Please try again.');
        });
}