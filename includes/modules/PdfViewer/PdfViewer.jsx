// External Dependencies
import { Component } from 'react';

// Internal Dependencies
import './style.css';

class PdfViewer extends Component {

  static slug = 'dicm_pdf_viewer';

  render() {
    const {
      pdf_file,
      pdf_title,
      pdf_description,
      display_mode,
      viewer_height,
      enable_toolbar,
      show_download_button,
      download_button_text,
      open_in_new_tab
    } = this.props;

    // If no PDF file is selected, show placeholder
    if (!pdf_file) {
      return (
        <div className="dicm-pdf-placeholder">
          <p>Please select a PDF file to display.</p>
        </div>
      );
    }

    // Build toolbar parameter
    const toolbarParam = enable_toolbar === 'on' ? '' : '#toolbar=0';
    const height = viewer_height || '600px';
    const target = open_in_new_tab === 'on' ? '_blank' : '_self';
    const buttonText = download_button_text || 'Download PDF';

    return (
      <div className="dicm-pdf-container">
        {pdf_title && (
          <h3 className="dicm-pdf-title">{pdf_title}</h3>
        )}
        
        {pdf_description && (
          <div 
            className="dicm-pdf-description"
            dangerouslySetInnerHTML={{ __html: pdf_description }}
          />
        )}
        
        {display_mode !== 'download' && (
          <div className="dicm-pdf-viewer" style={{ height: height }}>
            <object
              data={`${pdf_file}${toolbarParam}`}
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <embed
                src={`${pdf_file}${toolbarParam}`}
                type="application/pdf"
                width="100%"
                height="100%"
              />
              <p>
                Your browser does not support PDFs.{' '}
                <a 
                  href={pdf_file} 
                  target={target}
                  rel={open_in_new_tab === 'on' ? 'noopener noreferrer' : ''}
                >
                  Download the PDF
                </a>.
              </p>
            </object>
          </div>
        )}
        
        {display_mode !== 'embed' && (show_download_button === 'on' || display_mode === 'download') && (
          <div className="dicm-pdf-download">
            <a 
              href={pdf_file}
              className="dicm-pdf-download-button"
              target={target}
              rel={open_in_new_tab === 'on' ? 'noopener noreferrer' : ''}
              download
            >
              {buttonText}
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default PdfViewer;
