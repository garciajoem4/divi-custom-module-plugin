// External Dependencies
import { Component } from 'react';

// Internal Dependencies
import './style.css';

class PopupModule extends Component {

  static slug = 'dicm_popup_module';

  render() {
    const {
      popup_title,
      content_element_id,
      content_fallback,
      trigger_type,
      trigger_text,
      popup_animation,
      popup_position,
      popup_width,
      popup_height,
      popup_custom_height,
      show_close_button,
      overlay_color,
      overlay_opacity
    } = this.props;

    // Build inline styles for popup
    const popupStyles = {
      width: popup_width || '600px',
      height: popup_height === 'custom' ? popup_custom_height || '400px' : 'auto'
    };

    // Build overlay styles
    const overlayStyles = {
      backgroundColor: overlay_color || '#000000',
      opacity: overlay_opacity || '0.8'
    };

    return (
      <div className="dicm-popup-module-preview">
        {/* Show trigger button if trigger type is button */}
        {trigger_type === 'button' && (
          <button className="dicm-popup-trigger">
            {trigger_text || 'Open Popup'}
          </button>
        )}
        
        {/* Show popup preview in Visual Builder */}
        <div className="dicm-popup-preview-container">
          <div className="dicm-popup-preview-note">
            <strong>Popup Preview</strong>
            <br />
            <small>
              Trigger: {trigger_type === 'button' ? 'Button Click' : 
                       trigger_type === 'page_load' ? 'Page Load' :
                       trigger_type === 'scroll' ? 'Scroll' :
                       trigger_type === 'time_delay' ? 'Time Delay' :
                       trigger_type === 'exit_intent' ? 'Exit Intent' : 'Button Click'}
            </small>
          </div>
          
          <div className={`dicm-popup-overlay dicm-popup-${trigger_type} dicm-popup-anim-${popup_animation}`}>
            <div className="dicm-popup-overlay-bg" style={overlayStyles}></div>
            <div className={`dicm-popup-container dicm-popup-pos-${popup_position}`}>
              <div className="dicm-popup-content" style={popupStyles}>
                {show_close_button === 'on' && (
                  <button className="dicm-popup-close" aria-label="Close popup">&times;</button>
                )}
                
                {popup_title && (
                  <h3 className="dicm-popup-title">{popup_title}</h3>
                )}
                
                <div className="dicm-popup-inner dicm-popup-content-area">
                  {/* Content placeholder for nested modules */}
                  <div className="dicm-popup-content-placeholder">
                    <p>Add modules here by dragging them into this popup.</p>
                    <p><em>This preview shows how your popup will appear to visitors.</em></p>
                    <hr style={{margin: '15px 0', borderColor: '#ddd'}} />
                    <p><strong>Content Integration:</strong></p>
                    {content_element_id ? (
                      <div>
                        <p><small>✅ Target Element ID: <code>#{content_element_id}</code></small></p>
                        <p><small>Elements with this ID will be automatically moved into the popup when triggered.</small></p>
                        {content_fallback && (
                          <p><small>💾 Fallback content configured if element not found.</small></p>
                        )}
                      </div>
                    ) : (
                      <p><small>Set a "Content Element ID" to automatically integrate page elements into this popup.</small></p>
                    )}
                  </div>
                  
                  {/* Render any children/content that might be passed */}
                  {this.props.children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PopupModule;
