// External Dependencies
import { Component } from 'react';

// Internal Dependencies
import './style.css';

class AweberFormEmbed extends Component {

  static slug = 'dicm_aweber_form_embed';

  render() {
    const {
      form_title,
      form_description,
      aweber_form_class,
      aweber_script_url,
      aweber_script_id,
      container_alignment,
      form_max_width,
      custom_css_class
    } = this.props;

    // Check if required fields are provided
    const hasRequiredFields = aweber_form_class && aweber_script_url && aweber_script_id;

    // Build container classes
    const containerClasses = ['dicm-aweber-embed-container'];
    if (custom_css_class) {
      containerClasses.push(custom_css_class);
    }

    // Build container styles
    const containerStyles = {
      maxWidth: form_max_width || '600px',
      margin: '0 auto',
      textAlign: container_alignment || 'center'
    };

    if (!hasRequiredFields) {
      return (
        <div className="dicm-aweber-embed-error" style={{
          padding: '20px',
          background: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          <strong>AWeber Form Embed:</strong> Please configure the AWeber Form Class, Script URL, and Script ID in the module settings.
          <br /><br />
          <small>Find these values in your AWeber account under Forms → Web Forms → Get HTML</small>
        </div>
      );
    }

    return (
      <div className={containerClasses.join(' ')} style={containerStyles}>
        {form_title && (
          <h3 className="dicm-aweber-embed-title">{form_title}</h3>
        )}
        
        {form_description && (
          <div 
            className="dicm-aweber-embed-description"
            dangerouslySetInnerHTML={{ __html: form_description }}
          />
        )}
        
        <div className="dicm-aweber-embed-preview" style={{
          padding: '40px 20px',
          background: '#f8f9fa',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>📧</div>
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>
            AWeber Form Preview
          </div>
          <div style={{ fontSize: '12px' }}>
            Form Class: {aweber_form_class}
          </div>
          <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
            The actual AWeber form will appear here on the live site
          </div>
        </div>
      </div>
    );
  }
}

export default AweberFormEmbed;
