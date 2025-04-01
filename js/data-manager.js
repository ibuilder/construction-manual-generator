/**
 * JavaScript for managing manual data
 * Handles saving, loading, and processing data
 */

/**
 * Save manual data to local storage
 * @param {string} name - Name of the project
 * @param {Object} data - Manual data
 * @param {string} [id] - Optional ID for existing project
 * @returns {string} - ID of the saved project
 */
function saveManualData(name, data, id = null) {
    // Generate an ID if not provided
    const projectId = id || generateUniqueId();
    
    // Get existing projects
    let savedProjects = getSavedProjects();
    
    // Create project object
    const projectData = {
        id: projectId,
        name: name,
        data: data,
        savedDate: new Date().toISOString()
    };
    
    // Check if this project already exists
    const existingIndex = savedProjects.findIndex(project => project.id === projectId);
    
    if (existingIndex !== -1) {
        // Update existing project
        savedProjects[existingIndex] = projectData;
    } else {
        // Add new project
        savedProjects.push(projectData);
    }
    
    // Save to local storage
    localStorage.setItem('constructionManualProjects', JSON.stringify(savedProjects));
    
    return projectId;
}

/**
 * Load manual data from local storage
 * @param {string} id - ID of the project to load
 * @returns {Object|null} - Project data or null if not found
 */
function loadManualData(id) {
    const savedProjects = getSavedProjects();
    return savedProjects.find(project => project.id === id) || null;
}

/**
 * Get list of saved projects
 * @returns {Array} - Array of saved projects
 */
function getSavedProjects() {
    const savedProjects = localStorage.getItem('constructionManualProjects');
    return savedProjects ? JSON.parse(savedProjects) : [];
}

/**
 * Delete a saved project
 * @param {string} id - ID of the project to delete
 * @returns {boolean} - Whether the deletion was successful
 */
function deleteManualData(id) {
    let savedProjects = getSavedProjects();
    
    // Filter out the project to delete
    const updatedProjects = savedProjects.filter(project => project.id !== id);
    
    // Check if any project was removed
    if (updatedProjects.length < savedProjects.length) {
        localStorage.setItem('constructionManualProjects', JSON.stringify(updatedProjects));
        return true;
    }
    
    return false;
}

/**
 * Process manual data to generate HTML content
 * @param {Object} data - Manual data
 * @returns {string} - HTML content for the manual
 */
function processManualData(data) {
    // Start building the HTML content
    let html = '';
    
    // Add cover page
    html += createCoverPage(data);
    
    // Add table of contents
    html += createTableOfContents(data);
    
    // Add manual sections
    if (data.includeGeneralInfo === 'on') {
        html += createGeneralInfoSection(data);
    }
    
    if (data.includeProjectStaff === 'on') {
        html += createProjectStaffSection(data);
    }
    
    if (data.includeMiscInfo === 'on') {
        html += createMiscInfoSection(data);
    }
    
    if (data.includeSubcontractorPersonnel === 'on') {
        html += createSubcontractorPersonnelSection(data);
    }
    
    if (data.includeRulesRegulations === 'on') {
        html += createRulesRegulationsSection(data);
    }
    
    if (data.includeBeforeWork === 'on') {
        html += createBeforeWorkSection(data);
    }
    
    if (data.includeStoredMaterials === 'on') {
        html += createStoredMaterialsSection(data);
    }
    
    if (data.includeInsurance === 'on') {
        html += createInsuranceSection(data);
    }
    
    if (data.includeSubmittals === 'on') {
        html += createSubmittalsSection(data);
    }
    
    if (data.includeCostBreakdown === 'on') {
        html += createCostBreakdownSection(data);
    }
    
    if (data.includePayRequisition === 'on') {
        html += createPayRequisitionSection(data);
    }
    
    if (data.includeChecklist === 'on') {
        html += createChecklistSection(data);
    }
    
    if (data.includeManpowerReport === 'on') {
        html += createManpowerReportSection(data);
    }
    
    if (data.includeRFI === 'on') {
        html += createRFISection(data);
    }
    
    if (data.includeChangeOrders === 'on') {
        html += createChangeOrdersSection(data);
    }
    
    if (data.includeSafety === 'on') {
        html += createSafetySection(data);
    }
    
    if (data.includeSafetyCompliance === 'on') {
        html += createSafetyComplianceSection(data);
    }
    
    if (data.includeAcknowledgment === 'on') {
        html += createAcknowledgmentSection(data);
    }
    
    if (data.includeCleanup === 'on') {
        html += createCleanupSection(data);
    }
    
    if (data.includeReceipt === 'on') {
        html += createReceiptSection(data);
    }
    
    return html;
}

/**
 * Create the cover page HTML
 * @param {Object} data - Manual data
 * @returns {string} - HTML for the cover page
 */
function createCoverPage(data) {
    let html = `
        <div class="manual-cover page-break">
    `;
    
    // Add logo if provided
    if (data.logoImage) {
        html += `
            <img src="${data.logoImage}" alt="Company Logo" class="company-logo">
        `;
    }
    
    html += `
            <h1 class="manual-cover-title">${escapeHtml(data.companyName || 'COMPANY NAME')}</h1>
            <h2 class="manual-cover-project">Construction Project Manual</h2>
            <h3 class="manual-cover-project">${escapeHtml(data.projectTitle || 'PROJECT TITLE')}</h3>
            <p class="manual-cover-date">${new Date().toLocaleDateString()}</p>
        </div>
    `;
    
    return html;
}

/**
 * Create the table of contents HTML
 * @param {Object} data - Manual data
 * @returns {string} - HTML for the table of contents
 */
function createTableOfContents(data) {
    let html = `
        <div class="table-of-contents page-break">
            <h2 class="table-of-contents-title">Contents</h2>
            <div class="table-of-contents-items">
    `;
    
    let pageNumber = 3; // Starting page number after cover and TOC
    
    // Add TOC items for each section that is included
    if (data.includeGeneralInfo === 'on') {
        html += createTOCItem('General Information', pageNumber++);
    }
    
    if (data.includeProjectStaff === 'on') {
        html += createTOCItem('Project Staff, Job Information and Policy', pageNumber++);
    }
    
    if (data.includeMiscInfo === 'on') {
        html += createTOCItem('Miscellaneous Information', pageNumber++);
    }
    
    if (data.includeSubcontractorPersonnel === 'on') {
        html += createTOCItem('List of Subcontractor Key Personnel', pageNumber++);
    }
    
    if (data.includeRulesRegulations === 'on') {
        html += createTOCItem('Rules and Regulations', pageNumber++);
    }
    
    if (data.includeBeforeWork === 'on') {
        html += createTOCItem('Before You Start Work', pageNumber++);
    }
    
    if (data.includeStoredMaterials === 'on') {
        html += createTOCItem('Stored Materials', pageNumber++);
    }
    
    if (data.includeInsurance === 'on') {
        html += createTOCItem('Certificate of Insurance', pageNumber++);
    }
    
    if (data.includeSubmittals === 'on') {
        html += createTOCItem('Submittals - Shop Drawings, Samples, Manufacturer\'s Literature', pageNumber++);
    }
    
    if (data.includeCostBreakdown === 'on') {
        html += createTOCItem('Cost Breakdown', pageNumber++);
    }
    
    if (data.includePayRequisition === 'on') {
        html += createTOCItem('Monthly Pay Requisition', pageNumber++);
    }
    
    if (data.includeChecklist === 'on') {
        html += createTOCItem('Checklist for Payment Requisitions', pageNumber++);
    }
    
    if (data.includeManpowerReport === 'on') {
        html += createTOCItem('Subcontractor\'s Daily Manpower Report', pageNumber++);
    }
    
    if (data.includeRFI === 'on') {
        html += createTOCItem('Request for Information Form', pageNumber++);
    }
    
    if (data.includeChangeOrders === 'on') {
        html += createTOCItem('Proposals and Change Orders', pageNumber++);
    }
    
    if (data.includeSafety === 'on') {
        html += createTOCItem('Safety', pageNumber++);
    }
    
    if (data.includeSafetyCompliance === 'on') {
        html += createTOCItem('Compliance with Safety Program', pageNumber++);
    }
    
    if (data.includeAcknowledgment === 'on') {
        html += createTOCItem('Acknowledge of Receipt and Compliance', pageNumber++);
    }
    
    if (data.includeCleanup === 'on') {
        html += createTOCItem('Clean-Up', pageNumber++);
    }
    
    if (data.includeReceipt === 'on') {
        html += createTOCItem('Subcontractor\'s Acknowledgment of Receipt', pageNumber++);
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

/**
 * Create a table of contents item
 * @param {string} title - Section title
 * @param {number} pageNum - Page number
 * @returns {string} - HTML for the TOC item
 */
function createTOCItem(title, pageNum) {
    return `
        <div class="table-of-contents-item">
            <span>${escapeHtml(title)}</span>
            <span class="table-of-contents-page">${pageNum}</span>
        </div>
    `;
}

/**
 * Create the General Information section HTML
 * @param {Object} data - Manual data
 * @returns {string} - HTML for the section
 */
function createGeneralInfoSection(data) {
    return `
        <div class="manual-section page-break">
            <h2 class="manual-section-title">GENERAL INFORMATION</h2>
            <p>
                The purpose of this booklet is to familiarize you with not only the new
                Project but also to inform you of our Company policies and the Project
                Specifications requirements. If you follow the instructions provided
                within the contents of this manual, the administrative portions of the
                contract will flow much smoother, insuring you of timely payments as
                well as assistance from our Staff on the project.
            </p>
            <p>
                Our jobsite is located (see attached map). The administration of all
                phases of the project will be done solely from the project office. The
                Project Executive is ${escapeHtml(data.projectExecutive || '')}. All correspondence relating to the project should
                be directed to him at the project office. The mailing address is ${escapeHtml(data.mailingAddress || '')}. Our
                delivery address is: ${escapeHtml(data.shippingAddress || '')}. Our telephone number is ${escapeHtml(data.telephoneNumber || '')} and
                our fax number is ${escapeHtml(data.faxNumber || '')}.
            </p>
            ${data.mapImage ? `<div class="text-center mb-4"><img src="${data.mapImage}" alt="Site Map" style="max-width: 100%; max-height: 400px;"></div>` : ''}
            <p>
                We are looking forward to working with you and invite you to discuss any
                matters with us which are pertinent to the timely completion of the
                project.
            </p>
        </div>
    `;
}

/**
 * Create the Project Staff section HTML
 * @param {Object} data - Manual data
 * @returns {string} - HTML for the section
 */
function createProjectStaffSection(data) {
    let html = `
        <div class="manual-section page-break">
            <h2 class="manual-section-title">PROJECT STAFF, JOB INFORMATION AND POLICY</h2>
            <p>
                The ${escapeHtml(data.companyName || 'COMPANY NAME')} staff members presently assigned to the
                project are:
            </p>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add staff members
    if (data.projectExecutive) {
        html += `
            <tr>
                <td>Project Executive</td>
                <td>${escapeHtml(data.projectExecutive)}</td>
            </tr>
        `;
    }
    
    if (data.projectManager) {
        html += `
            <tr>
                <td>Project Manager</td>
                <td>${escapeHtml(data.projectManager)}</td>
            </tr>
        `;
    }
    
    if (data.projectSuperintendent) {
        html += `
            <tr>
                <td>Project Superintendent</td>
                <td>${escapeHtml(data.projectSuperintendent)}</td>
            </tr>
        `;
    }
    
    if (data.projectEngineer1) {
        html += `
            <tr>
                <td>Project Engineer</td>
                <td>${escapeHtml(data.projectEngineer1)}</td>
            </tr>
        `;
    }
    
    if (data.projectEngineer2) {
        html += `
            <tr>
                <td>Project Engineer</td>
                <td>${escapeHtml(data.projectEngineer2)}</td>
            </tr>
        `;
    }
    
    if (data.projectEngineer3) {
        html += `
            <tr>
                <td>Project Engineer</td>
                <td>${escapeHtml(data.projectEngineer3)}</td>
            </tr>
        `;
    }
    
    if (data.fieldEngineer) {
        html += `
            <tr>
                <td>Field Engineer</td>
                <td>${escapeHtml(data.fieldEngineer)}</td>
            </tr>
        `;
    }
    
    if (data.projectAccountant) {
        html += `
            <tr>
                <td>Project Accountant</td>
                <td>${escapeHtml(data.projectAccountant)}</td>
            </tr>
        `;
    }
    
    // Add additional staff members if any
    if (data.additionalStaffTitle && Array.isArray(data.additionalStaffTitle)) {
        for (let i = 0; i < data.additionalStaffTitle.length; i++) {
            if (data.additionalStaffTitle[i] && data.additionalStaffName && data.additionalStaffName[i]) {
                html += `
                    <tr>
                        <td>${escapeHtml(data.additionalStaffTitle[i])}</td>
                        <td>${escapeHtml(data.additionalStaffName[i])}</td>
                    </tr>
                `;
            }
        }
    }
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

// Similar functions would be created for all other sections...
// For brevity, I'll include just a sample of the remaining section functions

/**
 * Create the Miscellaneous Information section HTML
 * @param {Object} data - Manual data
 * @returns {string} - HTML for the section
 */
function createMiscInfoSection(data) {
    return `
        <div class="manual-section page-break">
            <h2 class="manual-section-title">MISCELLANEOUS INFORMATION</h2>
            <table class="table table-bordered">
                <tbody>
                    <tr>
                        <th>Project Title</th>
                        <td>${escapeHtml(data.projectTitle || '')}</td>
                    </tr>
                    <tr>
                        <th>Owner</th>
                        <td>${escapeHtml(data.owner || '')}</td>
                    </tr>
                    <tr>
                        <th>Developer in Charge</th>
                        <td>${escapeHtml(data.developerInCharge || '')}</td>
                    </tr>
                    <tr>
                        <th>Architect</th>
                        <td>${escapeHtml(data.architect || '')}</td>
                    </tr>
                    <tr>
                        <th>Architect in Charge</th>
                        <td>${escapeHtml(data.architectInCharge || '')}</td>
                    </tr>
                    <tr>
                        <th>Mailing Address</th>
                        <td>${escapeHtml(data.mailingAddress || '').replace(/\n/g, '<br>')}</td>
                    </tr>
                    <tr>
                        <th>Shipping Address</th>
                        <td>${escapeHtml(data.shippingAddress || '').replace(/\n/g, '<br>')}</td>
                    </tr>
                    <tr>
                        <th>Telephone Number</th>
                        <td>${escapeHtml(data.telephoneNumber || '')}</td>
                    </tr>
                    <tr>
                        <th>Fax Number</th>
                        <td>${escapeHtml(data.faxNumber || '')}</td>
                    </tr>
                    <tr>
                        <th>Hours of Work</th>
                        <td>${escapeHtml(data.workHours || 'Normal work hours are from 7:00 a.m. to 3:30 p.m. Monday thru Friday')}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Create the Subcontractor Key Personnel section HTML
 * @param {Object} data - Manual data
 * @returns {string} - HTML for the section
 */
function createSubcontractorPersonnelSection(data) {
    return `
        <div class="manual-section page-break">
            <h2 class="manual-section-title">LIST OF SUBCONTRACTOR KEY PERSONNEL</h2>
            <p>
                In an effort to expedite the administration of your subcontract /
                purchase order for this project, we request that you advise this office,
                by return mail, the following names of the individuals you have assigned
                to execute the following duties:
            </p>
            <table class="table table-bordered">
                <tbody>
                    <tr>
                        <td colspan="2">Name of Subcontractor</td>
                    </tr>
                    <tr>
                        <td colspan="2">Contract Manager</td>
                    </tr>
                    <tr>
                        <td colspan="2">Project Manager</td>
                    </tr>
                    <tr>
                        <td colspan="2">Field Installation Coordinator</td>
                    </tr>
                    <tr>
                        <td colspan="2">Field Superintendent</td>
                    </tr>
                    <tr>
                        <td colspan="2">Submittal Review Expediter / Coordinator</td>
                    </tr>
                    <tr>
                        <td colspan="2">Payroll & Accounting</td>
                    </tr>
                    <tr>
                        <td colspan="2">Project Safety Representative</td>
                    </tr>
                </tbody>
            </table>
            <p class="mt-4">
                Please provide the following information so we may verify our records
                and insure they are correct:
            </p>
            <table class="table table-bordered">
                <tbody>
                    <tr>
                        <td colspan="2">Fax Number</td>
                    </tr>
                    <tr>
                        <td colspan="2">Telephone Number</td>
                    </tr>
                    <tr>
                        <td colspan="2">Emergency Telephone Number for Off-Hours Emergency</td>
                    </tr>
                    <tr>
                        <td colspan="2">Point of Contact (Preferably Field Supt/Foreman)</td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-bordered mt-4">
                <tbody>
                    <tr>
                        <th>Address</th>
                        <th>Delivery Address</th>
                    </tr>
                    <tr>
                        <td style="height: 100px;"></td>
                        <td style="height: 100px;"></td>
                    </tr>
                </tbody>
            </table>
            <p>
                Your cooperation in providing the above information will be appreciated.
                Please complete the above and return it to our field office within the
                next seven (7) working days.
            </p>
        </div>
    `;
}

// Note: The remaining section functions would be implemented similarly
// Each would create the appropriate HTML for that section of the manual