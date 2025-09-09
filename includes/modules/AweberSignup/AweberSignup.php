<?php

class DICM_AweberSignup extends ET_Builder_Module {

	public $slug       = 'dicm_aweber_signup';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'MDM - Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'AWeber Signup', 'dicm-divi-custom-modules' );
		$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';
		
		// Enable advanced fields
		$this->advanced_fields = array(
			'borders'               => array(
				'default' => array(
					'css' => array(
						'main' => array(
							'border_radii'  => "%%order_class%% .dicm-aweber-container",
							'border_styles' => "%%order_class%% .dicm-aweber-container",
						),
					),
				),
			),
			'box_shadow'            => array(
				'default' => array(
					'css' => array(
						'main' => '%%order_class%% .dicm-aweber-container',
					),
				),
			),
			'margin_padding' => array(
				'css' => array(
					'important' => 'all',
				),
			),
			'fonts'                 => array(
				'title' => array(
					'label'    => esc_html__( 'Title', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-aweber-title",
					),
				),
				'description' => array(
					'label'    => esc_html__( 'Description', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-aweber-description",
					),
				),
				'button' => array(
					'label'    => esc_html__( 'Button', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-aweber-submit",
					),
				),
			),
			'background'            => array(
				'css' => array(
					'main' => "%%order_class%%",
				),
			),
		);
		
		// Handle form submission
		add_action( 'wp_ajax_dicm_aweber_submit', array( $this, 'handle_aweber_submission' ) );
		add_action( 'wp_ajax_nopriv_dicm_aweber_submit', array( $this, 'handle_aweber_submission' ) );
	}

	public function get_fields() {
		return array(
			'form_title' => array(
				'label'           => esc_html__( 'Form Title', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => 'Subscribe to our newsletter',
				'description'     => esc_html__( 'Title for the signup form.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'form_description' => array(
				'label'           => esc_html__( 'Description', 'dicm-divi-custom-modules' ),
				'type'            => 'textarea',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Optional description for the signup form.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'aweber_list_id' => array(
				'label'           => esc_html__( 'AWeber List ID', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'configuration',
				'description'     => esc_html__( 'Enter your AWeber list ID. You can find this in your AWeber account.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'aweber_settings',
			),
			'aweber_authorization_code' => array(
				'label'           => esc_html__( 'AWeber Authorization Code', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'configuration',
				'description'     => esc_html__( 'Enter your AWeber authorization code from your AWeber account integrations. This should be a long alphanumeric string.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'aweber_settings',
			),
			'debug_mode' => array(
				'label'           => esc_html__( 'Debug Mode', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'off',
				'description'     => esc_html__( 'Enable debug mode to see detailed error messages and credentials being used.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'aweber_settings',
			),
			'show_name_field' => array(
				'label'           => esc_html__( 'Show Name Field', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Show or hide the name field in the form.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'form_settings',
			),
			'name_placeholder' => array(
				'label'           => esc_html__( 'Name Placeholder', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => 'Enter your name',
				'description'     => esc_html__( 'Placeholder text for the name field.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'form_settings',
				'show_if'         => array(
					'show_name_field' => 'on',
				),
			),
			'email_placeholder' => array(
				'label'           => esc_html__( 'Email Placeholder', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => 'Enter your email address',
				'description'     => esc_html__( 'Placeholder text for the email field.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'form_settings',
			),
			'button_text' => array(
				'label'           => esc_html__( 'Button Text', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => 'Subscribe Now',
				'description'     => esc_html__( 'Text for the submit button.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'form_settings',
			),
			'success_message' => array(
				'label'           => esc_html__( 'Success Message', 'dicm-divi-custom-modules' ),
				'type'            => 'textarea',
				'option_category' => 'basic_option',
				'default'         => 'Thank you for subscribing! Please check your email to confirm your subscription.',
				'description'     => esc_html__( 'Message shown after successful subscription.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'messages',
			),
			'error_message' => array(
				'label'           => esc_html__( 'Error Message', 'dicm-divi-custom-modules' ),
				'type'            => 'textarea',
				'option_category' => 'basic_option',
				'default'         => 'There was an error processing your subscription. Please try again.',
				'description'     => esc_html__( 'Message shown when subscription fails.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'messages',
			),
			'enable_gdpr' => array(
				'label'           => esc_html__( 'Enable GDPR Consent', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'off',
				'description'     => esc_html__( 'Add GDPR consent checkbox for compliance.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'gdpr_settings',
			),
			'gdpr_text' => array(
				'label'           => esc_html__( 'GDPR Consent Text', 'dicm-divi-custom-modules' ),
				'type'            => 'textarea',
				'option_category' => 'basic_option',
				'default'         => 'I agree to receive marketing emails and understand I can unsubscribe at any time.',
				'description'     => esc_html__( 'Text for the GDPR consent checkbox.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'gdpr_settings',
				'show_if'         => array(
					'enable_gdpr' => 'on',
				),
			),
			'redirect_url' => array(
				'label'           => esc_html__( 'Redirect URL', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'configuration',
				'description'     => esc_html__( 'Optional: Redirect to this URL after successful subscription.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'form_settings',
			),
		);
	}

	public function get_settings_modal_toggles() {
		return array(
			'general'  => array(
				'toggles' => array(
					'main_content'    => esc_html__( 'Content', 'dicm-divi-custom-modules' ),
					'aweber_settings' => esc_html__( 'AWeber Settings', 'dicm-divi-custom-modules' ),
					'form_settings'   => esc_html__( 'Form Settings', 'dicm-divi-custom-modules' ),
					'messages'        => esc_html__( 'Messages', 'dicm-divi-custom-modules' ),
					'gdpr_settings'   => esc_html__( 'GDPR Settings', 'dicm-divi-custom-modules' ),
				),
			),
			'advanced' => array(
				'toggles' => array(
					'text' => array(
						'title'    => esc_html__( 'Text', 'dicm-divi-custom-modules' ),
						'priority' => 49,
					),
				),
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		$form_title               = $this->props['form_title'];
		$form_description         = $this->props['form_description'];
		$aweber_list_id          = $this->props['aweber_list_id'];
		$aweber_authorization_code = $this->props['aweber_authorization_code'];
		$show_name_field         = $this->props['show_name_field'];
		$name_placeholder        = $this->props['name_placeholder'];
		$email_placeholder       = $this->props['email_placeholder'];
		$button_text             = $this->props['button_text'];
		$enable_gdpr             = $this->props['enable_gdpr'];
		$gdpr_text               = $this->props['gdpr_text'];
		$redirect_url            = $this->props['redirect_url'];
		$debug_mode              = $this->props['debug_mode'];

		// Generate unique form ID
		$form_id = 'dicm-aweber-' . uniqid();

		// Enqueue frontend script
		wp_enqueue_script(
			'dicm-aweber-frontend',
			plugin_dir_url( __FILE__ ) . 'frontend.js',
			array( 'jquery' ),
			'1.0.1',
			true
		);

		// Localize script for AJAX
		wp_localize_script(
			'dicm-aweber-frontend',
			'dicm_aweber_ajax',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( 'dicm_aweber_nonce' ),
			)
		);

		// Build the output
		$output = '<div class="dicm-aweber-container">';

		// Add title if provided
		if ( ! empty( $form_title ) ) {
			$output .= sprintf( '<h3 class="dicm-aweber-title">%s</h3>', esc_html( $form_title ) );
		}

		// Add description if provided
		if ( ! empty( $form_description ) ) {
			$output .= sprintf( '<div class="dicm-aweber-description">%s</div>', wp_kses_post( $form_description ) );
		}

		// Form
		$output .= sprintf(
			'<form id="%s" class="dicm-aweber-form" method="post">',
			esc_attr( $form_id )
		);

		// Name field
		if ( 'on' === $show_name_field ) {
			$output .= sprintf(
				'<div class="dicm-aweber-field">
					<input type="text" name="subscriber_name" placeholder="%s" class="dicm-aweber-input" />
				</div>',
				esc_attr( $name_placeholder )
			);
		}

		// Email field
		$output .= sprintf(
			'<div class="dicm-aweber-field">
				<input type="email" name="subscriber_email" placeholder="%s" class="dicm-aweber-input" required />
			</div>',
			esc_attr( $email_placeholder )
		);

		// GDPR consent
		if ( 'on' === $enable_gdpr ) {
			$output .= sprintf(
				'<div class="dicm-aweber-field dicm-aweber-gdpr">
					<label>
						<input type="checkbox" name="gdpr_consent" required />
						<span class="dicm-aweber-gdpr-text">%s</span>
					</label>
				</div>',
				wp_kses_post( $gdpr_text )
			);
		}

		// Hidden fields
		$output .= sprintf(
			'<input type="hidden" name="aweber_list_id" value="%s" />
			<input type="hidden" name="aweber_authorization_code" value="%s" />
			<input type="hidden" name="redirect_url" value="%s" />
			<input type="hidden" name="action" value="dicm_aweber_submit" />
			<input type="hidden" name="nonce" value="%s" />',
			esc_attr( $aweber_list_id ),
			esc_attr( $aweber_authorization_code ),
			esc_url( $redirect_url ),
			wp_create_nonce( 'dicm_aweber_nonce' )
		);

		// Submit button
		$output .= sprintf(
			'<div class="dicm-aweber-field">
				<button type="submit" class="dicm-aweber-submit">%s</button>
			</div>',
			esc_html( $button_text )
		);

		$output .= '</form>';

		// Messages containers
		$output .= '<div class="dicm-aweber-messages">
			<div class="dicm-aweber-success" style="display:none;"></div>
			<div class="dicm-aweber-error" style="display:none;"></div>
			<div class="dicm-aweber-loading" style="display:none;">
				<span class="dicm-loading-spinner"></span> Processing...
			</div>
		</div>';

		// Debug information (if enabled)
		if ( 'on' === $debug_mode ) {
			$output .= '<div class="dicm-aweber-debug" style="margin-top: 15px; padding: 10px; background: #f0f0f0; border: 1px solid #ddd; font-size: 12px;">';
			$output .= '<strong>Debug Information:</strong><br>';
			$output .= 'List ID: ' . esc_html( $aweber_list_id ) . '<br>';
			$output .= 'Authorization Code: ' . esc_html( substr( $aweber_authorization_code, 0, 20 ) ) . '...<br>';
			$output .= 'Form ID: ' . esc_html( $form_id ) . '<br>';
			$output .= '<em>Check browser console and server error logs for more details.</em>';
			$output .= '</div>';
		}

		$output .= '</div>';

		return $output;
	}

	public function handle_aweber_subscription( $email, $name = '', $list_id = '', $authorization_code = '' ) {
		if ( empty( $email ) || empty( $list_id ) || empty( $authorization_code ) ) {
			error_log( 'AWeber: Missing required parameters' );
			return array( 'success' => false, 'message' => 'Missing required parameters' );
		}

		// First, get account info using the authorization code
		$accounts_response = wp_remote_get( 'https://api.aweber.com/1.0/accounts', array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $authorization_code,
				'User-Agent'    => 'WordPress AWeber Integration/1.0',
			),
			'timeout' => 15,
		) );

		if ( is_wp_error( $accounts_response ) ) {
			error_log( 'AWeber API Error: ' . $accounts_response->get_error_message() );
			return array( 'success' => false, 'message' => 'Connection error: ' . $accounts_response->get_error_message() );
		}

		$accounts_code = wp_remote_retrieve_response_code( $accounts_response );
		$accounts_body = wp_remote_retrieve_body( $accounts_response );

		if ( $accounts_code !== 200 ) {
			error_log( 'AWeber API Error: HTTP ' . $accounts_code . ' - ' . $accounts_body );
			return array( 'success' => false, 'message' => 'Authorization failed. Please check your authorization code.' );
		}

		$accounts_data = json_decode( $accounts_body, true );
		
		if ( empty( $accounts_data['entries'] ) ) {
			error_log( 'AWeber API Error: No accounts found' );
			return array( 'success' => false, 'message' => 'No AWeber accounts found' );
		}

		// Get the first account ID
		$account_id = $accounts_data['entries'][0]['id'];
		
		// Build the subscriber API endpoint
		$api_url = sprintf( 'https://api.aweber.com/1.0/accounts/%s/lists/%s/subscribers', $account_id, $list_id );
		
		$subscriber_data = array(
			'email' => $email,
			'name'  => $name,
		);

		// Add IP address if available
		if ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
			$subscriber_data['ip_address'] = $_SERVER['REMOTE_ADDR'];
		}

		$response = wp_remote_post( $api_url, array(
			'headers' => array(
				'Authorization' => 'Bearer ' . $authorization_code,
				'Content-Type'  => 'application/json',
				'User-Agent'    => 'WordPress AWeber Integration/1.0',
			),
			'body'    => json_encode( $subscriber_data ),
			'timeout' => 15,
		) );

		if ( is_wp_error( $response ) ) {
			error_log( 'AWeber Subscription Error: ' . $response->get_error_message() );
			return array( 'success' => false, 'message' => 'Connection error: ' . $response->get_error_message() );
		}

		$response_code = wp_remote_retrieve_response_code( $response );
		$response_body = wp_remote_retrieve_body( $response );

		// Log the full response for debugging
		error_log( 'AWeber API Response: HTTP ' . $response_code . ' - ' . $response_body );

		if ( $response_code === 201 || $response_code === 200 ) {
			return array( 'success' => true, 'message' => 'Subscription successful' );
		} else {
			// Parse error response
			$error_data = json_decode( $response_body, true );
			$error_message = 'Subscription failed';
			
			if ( isset( $error_data['error'] ) ) {
				if ( isset( $error_data['error']['message'] ) ) {
					$error_message = $error_data['error']['message'];
				} elseif ( is_string( $error_data['error'] ) ) {
					$error_message = $error_data['error'];
				}
			}
			
			// Handle specific AWeber error codes
			if ( $response_code === 400 ) {
				$error_message = 'Bad request: ' . $error_message;
			} elseif ( $response_code === 401 ) {
				$error_message = 'Authorization failed. Please check your authorization code.';
			} elseif ( $response_code === 403 ) {
				$error_message = 'Access denied. Please check your list ID and permissions.';
			} elseif ( $response_code === 404 ) {
				$error_message = 'List not found. Please check your list ID.';
			}

			return array( 'success' => false, 'message' => $error_message );
		}
	}

	public function handle_aweber_submission() {
		// Verify nonce
		if ( ! wp_verify_nonce( $_POST['nonce'], 'dicm_aweber_nonce' ) ) {
			wp_die( 'Security check failed' );
		}

		$email              = sanitize_email( $_POST['subscriber_email'] );
		$name               = sanitize_text_field( $_POST['subscriber_name'] ?? '' );
		$list_id            = sanitize_text_field( $_POST['aweber_list_id'] );
		$authorization_code = sanitize_text_field( $_POST['aweber_authorization_code'] );
		$redirect_url       = esc_url_raw( $_POST['redirect_url'] ?? '' );

		// Validate email
		if ( ! is_email( $email ) ) {
			wp_send_json_error( array( 'message' => 'Invalid email address.' ) );
		}

		// Validate required AWeber settings
		if ( empty( $list_id ) ) {
			wp_send_json_error( array( 'message' => 'AWeber List ID is required.' ) );
		}

		if ( empty( $authorization_code ) ) {
			wp_send_json_error( array( 'message' => 'AWeber Authorization Code is required.' ) );
		}

		// Attempt subscription
		$result = $this->handle_aweber_subscription( $email, $name, $list_id, $authorization_code );

		if ( $result['success'] ) {
			$response = array(
				'message' => 'Thank you for subscribing! Please check your email to confirm your subscription.',
			);
			
			if ( ! empty( $redirect_url ) ) {
				$response['redirect'] = $redirect_url;
			}
			
			wp_send_json_success( $response );
		} else {
			// Use the detailed error message from the API
			wp_send_json_error( array( 'message' => $result['message'] ) );
		}
	}
}

new DICM_AweberSignup;
