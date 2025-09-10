<?php

class DICM_AweberFormEmbed extends ET_Builder_Module {

	public $slug       = 'dicm_aweber_form_embed';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'MDM - Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'AWeber Form Embed', 'dicm-divi-custom-modules' );
		$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';
		
		// Enable advanced fields
		$this->advanced_fields = array(
			'borders'               => array(
				'default' => array(
					'css' => array(
						'main' => array(
							'border_radii'  => "%%order_class%% .dicm-aweber-embed-container",
							'border_styles' => "%%order_class%% .dicm-aweber-embed-container",
						),
					),
				),
			),
			'box_shadow'            => array(
				'default' => array(
					'css' => array(
						'main' => '%%order_class%% .dicm-aweber-embed-container',
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
						'main' => "%%order_class%% .dicm-aweber-embed-title",
					),
				),
				'description' => array(
					'label'    => esc_html__( 'Description', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-aweber-embed-description",
					),
				),
			),
			'background'            => array(
				'css' => array(
					'main' => "%%order_class%%",
				),
			),
		);
	}

	public function get_fields() {
		return array(
			'form_title' => array(
				'label'           => esc_html__( 'Form Title', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Optional title for the form section.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'form_description' => array(
				'label'           => esc_html__( 'Description', 'dicm-divi-custom-modules' ),
				'type'            => 'textarea',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Optional description for the form section.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'aweber_form_class' => array(
				'label'           => esc_html__( 'AWeber Form Class', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'configuration',
				'description'     => esc_html__( 'Enter the form class from your AWeber embed code (e.g., "AW-Form-161104422"). Find this in AWeber under Forms > Web Forms > Get HTML.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'aweber_settings',
			),
			'aweber_script_url' => array(
				'label'           => esc_html__( 'AWeber Script URL', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'configuration',
				'description'     => esc_html__( 'Enter the script URL from your AWeber embed code (e.g., "//forms.aweber.com/form/22/161104422.js"). Find this in AWeber under Forms > Web Forms > Get HTML.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'aweber_settings',
			),
			'aweber_script_id' => array(
				'label'           => esc_html__( 'AWeber Script ID', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'configuration',
				'description'     => esc_html__( 'Enter the script ID from your AWeber embed code (e.g., "aweber-wjs-synjn67r1"). Find this in your AWeber embed code.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'aweber_settings',
			),
			'container_alignment' => array(
				'label'           => esc_html__( 'Form Alignment', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'layout',
				'options'         => array(
					'left'   => esc_html__( 'Left', 'dicm-divi-custom-modules' ),
					'center' => esc_html__( 'Center', 'dicm-divi-custom-modules' ),
					'right'  => esc_html__( 'Right', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'center',
				'description'     => esc_html__( 'Choose how to align the form.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'layout_settings',
			),
			'form_max_width' => array(
				'label'           => esc_html__( 'Form Max Width', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'layout',
				'default'         => '600px',
				'description'     => esc_html__( 'Maximum width of the form container (e.g., 600px, 100%).', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'layout_settings',
			),
			'custom_css_class' => array(
				'label'           => esc_html__( 'Custom CSS Class', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'configuration',
				'description'     => esc_html__( 'Add custom CSS classes for additional styling.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'advanced_settings',
			),
		);
	}

	public function get_settings_modal_toggles() {
		return array(
			'general'  => array(
				'toggles' => array(
					'main_content'      => esc_html__( 'Content', 'dicm-divi-custom-modules' ),
					'aweber_settings'   => esc_html__( 'AWeber Settings', 'dicm-divi-custom-modules' ),
					'layout_settings'   => esc_html__( 'Layout Settings', 'dicm-divi-custom-modules' ),
					'advanced_settings' => esc_html__( 'Advanced', 'dicm-divi-custom-modules' ),
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
		$form_title          = $this->props['form_title'];
		$form_description    = $this->props['form_description'];
		$aweber_form_class   = $this->props['aweber_form_class'];
		$aweber_script_url   = $this->props['aweber_script_url'];
		$aweber_script_id    = $this->props['aweber_script_id'];
		$container_alignment = $this->props['container_alignment'];
		$form_max_width      = $this->props['form_max_width'];
		$custom_css_class    = $this->props['custom_css_class'];

		// Validate required fields
		if ( empty( $aweber_form_class ) || empty( $aweber_script_url ) || empty( $aweber_script_id ) ) {
			return '<div class="dicm-aweber-embed-error" style="padding: 20px; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;">
				<strong>AWeber Form Embed Error:</strong> Please configure the AWeber Form Class, Script URL, and Script ID in the module settings.
			</div>';
		}

		// Sanitize inputs
		$aweber_form_class = sanitize_html_class( $aweber_form_class );
		$aweber_script_url = esc_url( $aweber_script_url );
		$aweber_script_id  = sanitize_html_class( $aweber_script_id );

		// Generate unique container ID
		$container_id = 'dicm-aweber-embed-' . uniqid();

		// Enqueue frontend JavaScript for Safari compatibility
		wp_enqueue_script(
			'dicm-aweber-embed-frontend',
			plugin_dir_url( __FILE__ ) . 'frontend.js',
			array( 'jquery' ),
			'1.0.0',
			true
		);

		// Build CSS classes
		$container_classes = array( 'dicm-aweber-embed-container' );
		if ( ! empty( $custom_css_class ) ) {
			$container_classes[] = sanitize_html_class( $custom_css_class );
		}

		// Build CSS styles
		$container_styles = array();
		if ( ! empty( $form_max_width ) ) {
			$container_styles[] = 'max-width: ' . esc_attr( $form_max_width );
		}
		if ( ! empty( $container_alignment ) ) {
			$container_styles[] = 'margin: 0 auto';
			$container_styles[] = 'text-align: ' . esc_attr( $container_alignment );
		}

		// Build the output
		$output = sprintf(
			'<div id="%s" class="%s" style="%s">',
			esc_attr( $container_id ),
			esc_attr( implode( ' ', $container_classes ) ),
			esc_attr( implode( '; ', $container_styles ) )
		);

		// Add title if provided
		if ( ! empty( $form_title ) ) {
			$output .= sprintf( '<h3 class="dicm-aweber-embed-title">%s</h3>', esc_html( $form_title ) );
		}

		// Add description if provided
		if ( ! empty( $form_description ) ) {
			$output .= sprintf( '<div class="dicm-aweber-embed-description">%s</div>', wp_kses_post( $form_description ) );
		}

		// AWeber form container
		$output .= sprintf( '<div class="%s"></div>', esc_attr( $aweber_form_class ) );

		// AWeber script
		$output .= sprintf(
			'<script type="text/javascript">
				(function(d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s); js.id = id;
					js.src = "%s";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, "script", "%s"));
			</script>',
			esc_js( $aweber_script_url ),
			esc_js( $aweber_script_id )
		);

		$output .= '</div>';

		return $output;
	}
}

new DICM_AweberFormEmbed;
