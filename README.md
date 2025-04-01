# Construction Project Manual Generator

A web-based application for generating customized construction project startup manuals. This tool allows project managers and administrators to create professional manuals by filling out a form with project-specific details.

## Features

- **Easy Form-Based Interface**: Create comprehensive manuals by completing a multi-step form
- **Customizable Content**: Select which sections to include in your manual
- **Preview Functionality**: View the generated manual before exporting
- **PDF Export**: Export manuals to PDF format for distribution
- **Save/Load Projects**: Save your work and return to it later
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (for loading CDN libraries)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/construction-manual-generator.git
   ```

2. Navigate to the project directory:
   ```
   cd construction-manual-generator
   ```

3. Open `index.html` in your browser or set up a local server:
   ```
   # Using Python 3
   python -m http.server
   
   # Using Node.js with http-server
   npx http-server
   ```

4. Access the application at `http://localhost:8000` (or the port specified by your server)

### Deployment

To deploy this application to a production environment:

1. Copy all files to your web server
2. No build process is required as this is a static web application
3. Ensure the server is configured to serve static files correctly

## Project Structure

```
construction-manual-generator/
├── index.html                     # Main application entry point
├── pages/                         # Additional HTML pages
│   ├── form.html                  # The form to input project data
│   ├── preview.html               # Preview of the generated manual
│   └── help.html                  # Help documentation
├── css/                           # CSS stylesheets
│   ├── main.css                   # Main styles
│   ├── form.css                   # Form-specific styles
│   └── print.css                  # Print/PDF export styles
├── js/                            # JavaScript files
│   ├── main.js                    # Main application logic
│   ├── form.js                    # Form handling functions
│   ├── preview.js                 # Preview functionality
│   ├── pdf-export.js              # PDF export functionality
│   ├── data-manager.js            # Handles data saving/loading
│   └── validation.js              # Form validation
└── README.md                      # Project documentation
```

## Usage

1. **Start a New Manual**:
   - From the home page, click "Create New Manual"
   - Fill out each section of the form with your project details

2. **Customize Your Manual**:
   - Select which sections to include
   - Add custom content as needed
   - Upload a site map or company logo if desired

3. **Generate the Manual**:
   - Click "Generate Manual" when you've completed the form
   - Review the preview to ensure all information is correct

4. **Export or Print**:
   - Click "Export to PDF" to create a PDF document
   - Click "Print" to print directly from the browser

5. **Save Your Project**:
   - Click "Save" to store your work for later editing
   - Projects are saved in your browser's local storage

## Technical Details

This application uses the following technologies:

- **HTML5**: For structure and content
- **CSS3**: For styling and responsiveness
- **JavaScript (ES6+)**: For client-side functionality
- **Bootstrap 5**: For UI components and responsive design
- **jQuery**: For DOM manipulation and event handling
- **html2pdf.js**: For PDF generation
- **localStorage API**: For saving project data

## Browser Compatibility

The application is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Base template adapted from Balfour Beatty Construction project manual
- Bootstrap team for the responsive framework
- html2pdf.js developers for the PDF export functionality