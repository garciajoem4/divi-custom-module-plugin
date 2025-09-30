<?php

class DICM_PopupIncomeCalculator extends ET_Builder_Module {

	public $slug       = 'dicm_popup_income_calculator';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => '',
		'author'     => 'DICM',
		'author_uri' => '',
	);

	public function init() {
		$this->name = esc_html__( 'Popup Income Calculator', 'dicm-divi-custom-modules' );
		$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';
		
		$this->settings_modal_toggles = array(
			'general'  => array(
				'toggles' => array(
					'main_content' => esc_html__( 'Content', 'dicm-divi-custom-modules' ),
					'button_settings' => esc_html__( 'Button Settings', 'dicm-divi-custom-modules' ),
				),
			),
			'advanced' => array(
				'toggles' => array(
					'layout' => esc_html__( 'Layout', 'dicm-divi-custom-modules' ),
					'text' => array(
						'title' => esc_html__( 'Text', 'dicm-divi-custom-modules' ),
					),
				),
			),
		);

		$this->advanced_fields = array(
			'fonts'          => array(
				'header' => array(
					'label'    => esc_html__( 'Header', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "{$this->main_css_element} .popup-header h2",
					),
					'header_level' => array(
						'default' => 'h2',
					),
				),
				'body'   => array(
					'label'    => esc_html__( 'Body', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "{$this->main_css_element} .popup-body",
					),
				),
				'button' => array(
					'label'    => esc_html__( 'Button', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "{$this->main_css_element} .calculate-income-btn",
					),
				),
			),
			'background'     => array(
				'settings' => array(
					'color' => 'alpha',
				),
			),
			'borders'        => array(
				'default' => array(),
			),
			'box_shadow'     => array(
				'default' => array(),
			),
			'margin_padding' => array(
				'css' => array(
					'important' => 'all',
				),
			),
		);
	}

	public function get_fields() {
		return array(
			'button_text' => array(
				'label'           => esc_html__( 'Button Text', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Text to display on the calculator button.', 'dicm-divi-custom-modules' ),
				'default'         => 'CALCULATE INCOME',
				'toggle_slug'     => 'button_settings',
			),
			'popup_title' => array(
				'label'           => esc_html__( 'Popup Title', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Title displayed in the popup header.', 'dicm-divi-custom-modules' ),
				'default'         => 'GET STARTED WITH YOUR INCOME',
				'toggle_slug'     => 'main_content',
			),
			'default_model' => array(
				'label'           => esc_html__( 'Default Model', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'configuration',
				'options'         => array(
					'WE BUY. WE OWN. WE FILL'  => esc_html__( 'We Buy. We Own. We Fill', 'dicm-divi-custom-modules' ),
					'YOU BUY. YOU OWN. WE FILL' => esc_html__( 'You Buy. You Own. We Fill', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'WE BUY. WE OWN. WE FILL',
				'description'     => esc_html__( 'Select the default business model to display.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'default_transactions' => array(
				'label'           => esc_html__( 'Default Transactions', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'configuration',
				'default'         => '125',
				'fixed_unit'      => '',
				'range_settings'  => array(
					'min'  => '1',
					'max'  => '500',
					'step' => '1',
				),
				'description'     => esc_html__( 'Default number of transactions to display.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'fee_amount' => array(
				'label'           => esc_html__( 'Fee Amount', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'configuration',
				'default'         => '3.50',
				'description'     => esc_html__( 'Fee amount used in income calculation (default: 3.50).', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug = null ) {
		$button_text = $this->props['button_text'];
		$popup_title = $this->props['popup_title'];
		$default_model = $this->props['default_model'];
		$default_transactions = $this->props['default_transactions'];
		$fee_amount = $this->props['fee_amount'];

		// Create configuration object for React component
		$config = array(
			'buttonText' => $button_text,
			'popupTitle' => $popup_title,
			'defaultModel' => $default_model,
			'defaultTransactions' => intval($default_transactions),
			'feeAmount' => floatval($fee_amount),
		);

		$config_json = wp_json_encode($config);

		// Enqueue React component
		wp_enqueue_script(
			'dicm-popup-income-calculator',
			plugin_dir_url(__FILE__) . '../../../scripts/frontend-bundle.min.js',
			array('react', 'react-dom'),
			'1.0.0',
			true
		);

		// Render the module
		return sprintf(
			'<div class="dicm-popup-income-calculator" data-config="%1$s"></div>',
			esc_attr($config_json)
		);
	}
}

new DICM_PopupIncomeCalculator;