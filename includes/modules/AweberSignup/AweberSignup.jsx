// External Dependencies
import { Component } from 'react';

// Internal Dependencies
import './style.css';

class AweberSignup extends Component {

  static slug = 'dicm_aweber_signup';

  render() {
    const {
      form_title,
      form_description,
      aweber_list_id,
      show_name_field,
      name_placeholder,
      email_placeholder,
      button_text,
      enable_gdpr,
      gdpr_text
    } = this.props;

    return (
      <div className="dicm-aweber-container">
        {form_title && (
          <h3 className="dicm-aweber-title">{form_title}</h3>
        )}
        
        {form_description && (
          <div 
            className="dicm-aweber-description"
            dangerouslySetInnerHTML={{ __html: form_description }}
          />
        )}
        
        <form className="dicm-aweber-form">
          {show_name_field === 'on' && (
            <div className="dicm-aweber-field">
              <input 
                type="text" 
                placeholder={name_placeholder || 'Enter your name'}
                className="dicm-aweber-input"
              />
            </div>
          )}
          
          <div className="dicm-aweber-field">
            <input 
              type="email" 
              placeholder={email_placeholder || 'Enter your email address'}
              className="dicm-aweber-input"
              required
            />
          </div>
          
          {enable_gdpr === 'on' && (
            <div className="dicm-aweber-field dicm-aweber-gdpr">
              <label>
                <input type="checkbox" required />
                <span className="dicm-aweber-gdpr-text">
                  {gdpr_text || 'I agree to receive marketing emails and understand I can unsubscribe at any time.'}
                </span>
              </label>
            </div>
          )}
          
          <div className="dicm-aweber-field">
            <button type="submit" className="dicm-aweber-submit">
              {button_text || 'Subscribe Now'}
            </button>
          </div>
        </form>
        
        <div className="dicm-aweber-messages">
          <div className="dicm-aweber-success" style={{ display: 'none' }}>
            Thank you for subscribing!
          </div>
          <div className="dicm-aweber-error" style={{ display: 'none' }}>
            There was an error. Please try again.
          </div>
        </div>
      </div>
    );
  }
}

export default AweberSignup;
