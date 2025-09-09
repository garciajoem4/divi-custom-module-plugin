<?php

class DICM_PopupModule extends ET_Builder_Module {

	public $slug       = 'dicm_popup_module';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'MDM - Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'Popup Module', 'dicm-divi-custom-modules' );
		$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';
		
		// Enable advanced fields
		$this->advanced_fields = array(
			'borders'               => array(
				'default' => array(
					'css' => array(
						'main' => array(
							'border_radii'  => "%%order_class%% .dicm-popup-content",
							'border_styles' => "%%order_class%% .dicm-popup-content",
						),
					),
				),
			),
			'box_shadow'            => array(
				'default' => array(
					'css' => array(
						'main' => '%%order_class%% .dicm-popup-content',
					),
				),
			),
			'margin_padding' => array(
				'css' => array(
					'main' => '%%order_class%% .dicm-popup-content',
					'important' => 'all',
				),
			),
			'fonts'                 => array(
				'trigger_button' => array(
					'label'    => esc_html__( 'Trigger Button', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-popup-trigger",
					),
				),
				'popup_title' => array(
					'label'    => esc_html__( 'Popup Title', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-popup-title",
					),
				),
			),
			'background'            => array(
				'css' => array(
					'main' => "%%order_class%% .dicm-popup-content",
				),
			),
		);
	}

	public function get_fields() {
		return array(
			'popup_title' => array(
				'label'           => esc_html__( 'Popup Title', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Optional title for the popup.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'trigger_type' => array(
				'label'           => esc_html__( 'Trigger Type', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'configuration',
				'options'         => array(
					'button'      => esc_html__( 'Button Click', 'dicm-divi-custom-modules' ),
					'page_load'   => esc_html__( 'Page Load', 'dicm-divi-custom-modules' ),
					'scroll'      => esc_html__( 'Scroll Percentage', 'dicm-divi-custom-modules' ),
					'time_delay'  => esc_html__( 'Time Delay', 'dicm-divi-custom-modules' ),
					'exit_intent' => esc_html__( 'Exit Intent', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'button',
				'description'     => esc_html__( 'Choose how the popup should be triggered.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'trigger_settings',
			),
			'trigger_text' => array(
				'label'           => esc_html__( 'Trigger Button Text', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => 'Open Popup',
				'description'     => esc_html__( 'Text for the trigger button.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'trigger_settings',
				'show_if'         => array(
					'trigger_type' => 'button',
				),
			),
			'delay_time' => array(
				'label'           => esc_html__( 'Delay Time (seconds)', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'configuration',
				'default'         => '3',
				'range_settings'  => array(
					'min'  => '1',
					'max'  => '60',
					'step' => '1',
				),
				'description'     => esc_html__( 'Time delay before popup appears.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'trigger_settings',
				'show_if'         => array(
					'trigger_type' => 'time_delay',
				),
			),
			'scroll_percentage' => array(
				'label'           => esc_html__( 'Scroll Percentage', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'configuration',
				'default'         => '50',
				'range_settings'  => array(
					'min'  => '10',
					'max'  => '100',
					'step' => '5',
				),
				'description'     => esc_html__( 'Percentage of page scrolled before popup appears.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'trigger_settings',
				'show_if'         => array(
					'trigger_type' => 'scroll',
				),
			),
			'popup_animation' => array(
				'label'           => esc_html__( 'Popup Animation', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'configuration',
				'options'         => array(
					'fade'        => esc_html__( 'Fade In', 'dicm-divi-custom-modules' ),
					'slide_up'    => esc_html__( 'Slide Up', 'dicm-divi-custom-modules' ),
					'slide_down'  => esc_html__( 'Slide Down', 'dicm-divi-custom-modules' ),
					'slide_left'  => esc_html__( 'Slide Left', 'dicm-divi-custom-modules' ),
					'slide_right' => esc_html__( 'Slide Right', 'dicm-divi-custom-modules' ),
					'zoom_in'     => esc_html__( 'Zoom In', 'dicm-divi-custom-modules' ),
					'zoom_out'    => esc_html__( 'Zoom Out', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'fade',
				'description'     => esc_html__( 'Choose the popup animation effect.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'animation_settings',
			),
			'popup_position' => array(
				'label'           => esc_html__( 'Popup Position', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'layout',
				'options'         => array(
					'center'       => esc_html__( 'Center', 'dicm-divi-custom-modules' ),
					'top_left'     => esc_html__( 'Top Left', 'dicm-divi-custom-modules' ),
					'top_center'   => esc_html__( 'Top Center', 'dicm-divi-custom-modules' ),
					'top_right'    => esc_html__( 'Top Right', 'dicm-divi-custom-modules' ),
					'bottom_left'  => esc_html__( 'Bottom Left', 'dicm-divi-custom-modules' ),
					'bottom_center' => esc_html__( 'Bottom Center', 'dicm-divi-custom-modules' ),
					'bottom_right' => esc_html__( 'Bottom Right', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'center',
				'description'     => esc_html__( 'Position of the popup on screen.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'position_settings',
			),
			'popup_width' => array(
				'label'           => esc_html__( 'Popup Width', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'layout',
				'default'         => '600px',
				'default_unit'    => 'px',
				'range_settings'  => array(
					'min'  => '300',
					'max'  => '1200',
					'step' => '10',
				),
				'description'     => esc_html__( 'Width of the popup.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'position_settings',
			),
			'popup_height' => array(
				'label'           => esc_html__( 'Popup Height', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'layout',
				'options'         => array(
					'auto'   => esc_html__( 'Auto', 'dicm-divi-custom-modules' ),
					'custom' => esc_html__( 'Custom', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'auto',
				'description'     => esc_html__( 'Height behavior of the popup.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'position_settings',
			),
			'popup_custom_height' => array(
				'label'           => esc_html__( 'Custom Height', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'layout',
				'default'         => '400px',
				'default_unit'    => 'px',
				'range_settings'  => array(
					'min'  => '200',
					'max'  => '800',
					'step' => '10',
				),
				'description'     => esc_html__( 'Custom height for the popup.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'position_settings',
				'show_if'         => array(
					'popup_height' => 'custom',
				),
			),
			'show_close_button' => array(
				'label'           => esc_html__( 'Show Close Button', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Show X close button in popup.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'close_settings',
			),
			'close_on_overlay' => array(
				'label'           => esc_html__( 'Close on Overlay Click', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Close popup when clicking outside of it.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'close_settings',
			),
			'close_on_escape' => array(
				'label'           => esc_html__( 'Close on Escape Key', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Close popup when pressing Escape key.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'close_settings',
			),
			'overlay_opacity' => array(
				'label'           => esc_html__( 'Overlay Opacity', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'layout',
				'default'         => '0.8',
				'range_settings'  => array(
					'min'  => '0.1',
					'max'  => '1',
					'step' => '0.1',
				),
				'description'     => esc_html__( 'Opacity of the background overlay.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'overlay_settings',
			),
			'overlay_color' => array(
				'label'           => esc_html__( 'Overlay Color', 'dicm-divi-custom-modules' ),
				'type'            => 'color-alpha',
				'option_category' => 'layout',
				'default'         => '#000000',
				'description'     => esc_html__( 'Color of the background overlay.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'overlay_settings',
			),
			'prevent_scroll' => array(
				'label'           => esc_html__( 'Prevent Background Scroll', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Prevent page scrolling when popup is open.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'behavior_settings',
			),
			'auto_close' => array(
				'label'           => esc_html__( 'Auto Close After (seconds)', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'configuration',
				'default'         => '0',
				'range_settings'  => array(
					'min'  => '0',
					'max'  => '60',
					'step' => '1',
				),
				'description'     => esc_html__( 'Auto close popup after specified seconds (0 = disabled).', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'behavior_settings',
			),
		);
	}

	public function get_settings_modal_toggles() {
		return array(
			'general'  => array(
				'toggles' => array(
					'main_content'       => esc_html__( 'Content', 'dicm-divi-custom-modules' ),
					'trigger_settings'   => esc_html__( 'Trigger Settings', 'dicm-divi-custom-modules' ),
					'animation_settings' => esc_html__( 'Animation', 'dicm-divi-custom-modules' ),
					'position_settings'  => esc_html__( 'Position & Size', 'dicm-divi-custom-modules' ),
					'close_settings'     => esc_html__( 'Close Options', 'dicm-divi-custom-modules' ),
					'overlay_settings'   => esc_html__( 'Overlay', 'dicm-divi-custom-modules' ),
					'behavior_settings'  => esc_html__( 'Behavior', 'dicm-divi-custom-modules' ),
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
		$popup_title        = $this->props['popup_title'];
		$trigger_type       = $this->props['trigger_type'];
		$trigger_text       = $this->props['trigger_text'];
		$delay_time         = $this->props['delay_time'];
		$scroll_percentage  = $this->props['scroll_percentage'];
		$popup_animation    = $this->props['popup_animation'];
		$popup_position     = $this->props['popup_position'];
		$popup_width        = $this->props['popup_width'];
		$popup_height       = $this->props['popup_height'];
		$popup_custom_height = $this->props['popup_custom_height'];
		$show_close_button  = $this->props['show_close_button'];
		$close_on_overlay   = $this->props['close_on_overlay'];
		$close_on_escape    = $this->props['close_on_escape'];
		$overlay_opacity    = $this->props['overlay_opacity'];
		$overlay_color      = $this->props['overlay_color'];
		$prevent_scroll     = $this->props['prevent_scroll'];
		$auto_close         = $this->props['auto_close'];

		// Generate unique popup ID
		$popup_id = 'dicm-popup-' . uniqid();

		// Enqueue frontend script
		wp_enqueue_script(
			'dicm-popup-frontend',
			plugin_dir_url( __FILE__ ) . 'frontend.js',
			array( 'jquery' ),
			'1.0.0',
			true
		);

		// Prepare popup configuration
		$popup_config = array(
			'trigger_type'      => $trigger_type,
			'delay_time'        => intval( $delay_time ),
			'scroll_percentage' => intval( $scroll_percentage ),
			'animation'         => $popup_animation,
			'position'          => $popup_position,
			'close_on_overlay'  => $close_on_overlay === 'on',
			'close_on_escape'   => $close_on_escape === 'on',
			'prevent_scroll'    => $prevent_scroll === 'on',
			'auto_close'        => intval( $auto_close ),
		);

		// Localize script for this popup
		wp_localize_script(
			'dicm-popup-frontend',
			'dicm_popup_config_' . str_replace( '-', '_', $popup_id ),
			$popup_config
		);

		// Build CSS styles
		$styles = '';
		if ( ! empty( $popup_width ) ) {
			$styles .= sprintf( 'width: %s;', esc_attr( $popup_width ) );
		}
		if ( $popup_height === 'custom' && ! empty( $popup_custom_height ) ) {
			$styles .= sprintf( 'height: %s;', esc_attr( $popup_custom_height ) );
		}

		// Overlay styles
		$overlay_styles = sprintf(
			'background-color: %s; opacity: %s;',
			esc_attr( $overlay_color ),
			esc_attr( $overlay_opacity )
		);

		// Build the output
		$output = '';

		// Trigger element (if button type)
		if ( $trigger_type === 'button' ) {
			$output .= sprintf(
				'<button class="dicm-popup-trigger" data-popup-id="%s">%s</button>',
				esc_attr( $popup_id ),
				esc_html( $trigger_text )
			);
		}

		// Popup structure
		$output .= sprintf(
			'<div id="%s" class="dicm-popup-overlay dicm-popup-%s dicm-popup-anim-%s" style="display: none;" data-config="%s">
				<div class="dicm-popup-overlay-bg" style="%s"></div>
				<div class="dicm-popup-container dicm-popup-pos-%s">
					<div class="dicm-popup-content" style="%s">',
			esc_attr( $popup_id ),
			esc_attr( $trigger_type ),
			esc_attr( $popup_animation ),
			esc_attr( wp_json_encode( $popup_config ) ),
			esc_attr( $overlay_styles ),
			esc_attr( $popup_position ),
			esc_attr( $styles )
		);

		// Close button
		if ( $show_close_button === 'on' ) {
			$output .= '<button class="dicm-popup-close" aria-label="Close popup">&times;</button>';
		}

		// Popup title
		if ( ! empty( $popup_title ) ) {
			$output .= sprintf( '<h3 class="dicm-popup-title">%s</h3>', esc_html( $popup_title ) );
		}

		// Popup content (child modules)
		$output .= '<div class="dicm-popup-inner">';
		$output .= $content; // This will contain the nested modules
		$output .= '</div>';

		$output .= '
					</div>
				</div>
			</div>';

		return $output;
	}
}

new DICM_PopupModule;
