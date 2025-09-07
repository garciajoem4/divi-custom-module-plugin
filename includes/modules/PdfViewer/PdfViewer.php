<?php

class DICM_PdfViewer extends ET_Builder_Module {

	public $slug       = 'dicm_pdf_viewer';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'MDM - Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'PDF Viewer', 'dicm-divi-custom-modules' );
		$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';
		
		// Enqueue frontend script
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_scripts' ) );
		
		// Enable advanced fields
		$this->advanced_fields = array(
			'borders'               => array(
				'default' => array(
					'css' => array(
						'main' => array(
							'border_radii'  => "%%order_class%% .dicm-pdf-container",
							'border_styles' => "%%order_class%% .dicm-pdf-container",
						),
					),
				),
			),
			'box_shadow'            => array(
				'default' => array(
					'css' => array(
						'main' => '%%order_class%% .dicm-pdf-container',
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
						'main' => "%%order_class%% .dicm-pdf-title",
					),
				),
				'description' => array(
					'label'    => esc_html__( 'Description', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-pdf-description",
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

	/**
	 * Enqueue frontend scripts for PDF viewer functionality
	 */
	public function enqueue_frontend_scripts() {
		wp_enqueue_script(
			'dicm-pdf-viewer-frontend',
			plugin_dir_url( __FILE__ ) . 'frontend.js',
			array( 'jquery' ),
			'1.0.0',
			true
		);
	}

	public function get_fields() {
		return array(
			'pdf_file' => array(
				'label'              => esc_html__( 'PDF File', 'dicm-divi-custom-modules' ),
				'type'               => 'upload',
				'option_category'    => 'basic_option',
				'upload_button_text' => esc_attr__( 'Upload PDF', 'dicm-divi-custom-modules' ),
				'choose_text'        => esc_attr__( 'Choose PDF File', 'dicm-divi-custom-modules' ),
				'update_text'        => esc_attr__( 'Set PDF File', 'dicm-divi-custom-modules' ),
				'description'        => esc_html__( 'Select the PDF file you want to display.', 'dicm-divi-custom-modules' ),
				'toggle_slug'        => 'main_content',
				'data_type'          => 'file',
			),
			'pdf_title' => array(
				'label'           => esc_html__( 'Title', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Optional title for the PDF viewer.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'pdf_description' => array(
				'label'           => esc_html__( 'Description', 'dicm-divi-custom-modules' ),
				'type'            => 'textarea',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Optional description for the PDF.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
			'display_mode' => array(
				'label'           => esc_html__( 'Display Mode', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'configuration',
				'options'         => array(
					'embed'    => esc_html__( 'Embed Viewer', 'dicm-divi-custom-modules' ),
					'download' => esc_html__( 'Download Link Only', 'dicm-divi-custom-modules' ),
					'both'     => esc_html__( 'Embed + Download Link', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'embed',
				'description'     => esc_html__( 'Choose how to display the PDF.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'display_settings',
			),
			'viewer_height' => array(
				'label'           => esc_html__( 'Viewer Height', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'layout',
				'default'         => '600px',
				'default_unit'    => 'px',
				'range_settings'  => array(
					'min'  => '200',
					'max'  => '1200',
					'step' => '10',
				),
				'description'     => esc_html__( 'Set the height of the PDF viewer.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'display_settings',
				'show_if'         => array(
					'display_mode' => array( 'embed', 'both' ),
				),
			),
			'enable_toolbar' => array(
				'label'           => esc_html__( 'Show PDF Toolbar', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Show or hide the PDF toolbar with navigation controls.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'display_settings',
				'show_if'         => array(
					'display_mode' => array( 'embed', 'both' ),
				),
			),
			'enable_navigation' => array(
				'label'           => esc_html__( 'Show Navigation Pane', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Show or hide the navigation pane for multi-page PDFs.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'display_settings',
				'show_if'         => array(
					'display_mode' => array( 'embed', 'both' ),
				),
			),
			'enable_scrollbar' => array(
				'label'           => esc_html__( 'Show Scrollbar', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Show or hide the scrollbar for PDF navigation.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'display_settings',
				'show_if'         => array(
					'display_mode' => array( 'embed', 'both' ),
				),
			),
			'show_download_button' => array(
				'label'           => esc_html__( 'Show Download Button', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Show download button below the viewer.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'download_settings',
				'show_if'         => array(
					'display_mode' => array( 'embed', 'both' ),
				),
			),
			'download_button_text' => array(
				'label'           => esc_html__( 'Download Button Text', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'default'         => 'Download PDF',
				'description'     => esc_html__( 'Text for the download button.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'download_settings',
				'show_if'         => array(
					'show_download_button' => 'on',
				),
			),
			'open_in_new_tab' => array(
				'label'           => esc_html__( 'Open in New Tab', 'dicm-divi-custom-modules' ),
				'type'            => 'yes_no_button',
				'option_category' => 'configuration',
				'options'         => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'on',
				'description'     => esc_html__( 'Open PDF in new tab when clicked.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'download_settings',
			),
		);
	}

	public function get_settings_modal_toggles() {
		return array(
			'general'  => array(
				'toggles' => array(
					'main_content'      => esc_html__( 'PDF Content', 'dicm-divi-custom-modules' ),
					'display_settings'  => esc_html__( 'Display Settings', 'dicm-divi-custom-modules' ),
					'download_settings' => esc_html__( 'Download Settings', 'dicm-divi-custom-modules' ),
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
		$pdf_file             = $this->props['pdf_file'];
		$pdf_title            = $this->props['pdf_title'];
		$pdf_description      = $this->props['pdf_description'];
		$display_mode         = $this->props['display_mode'];
		$viewer_height        = $this->props['viewer_height'];
		$enable_toolbar       = $this->props['enable_toolbar'];
		$enable_navigation    = $this->props['enable_navigation'];
		$enable_scrollbar     = $this->props['enable_scrollbar'];
		$show_download_button = $this->props['show_download_button'];
		$download_button_text = $this->props['download_button_text'];
		$open_in_new_tab      = $this->props['open_in_new_tab'];

		// If no PDF file is selected, show placeholder
		if ( empty( $pdf_file ) ) {
			return sprintf(
				'<div class="dicm-pdf-placeholder">%s</div>',
				esc_html__( 'Please select a PDF file to display.', 'dicm-divi-custom-modules' )
			);
		}

		// Build the output
		$output = '<div class="dicm-pdf-container">';

		// Add title if provided
		if ( ! empty( $pdf_title ) ) {
			$output .= sprintf( '<h3 class="dicm-pdf-title">%s</h3>', esc_html( $pdf_title ) );
		}

		// Add description if provided
		if ( ! empty( $pdf_description ) ) {
			$output .= sprintf( '<div class="dicm-pdf-description">%s</div>', wp_kses_post( $pdf_description ) );
		}

		// Handle different display modes
		if ( 'download' !== $display_mode ) {
			// Embed viewer using iframe with better PDF support
			$height = ! empty( $viewer_height ) ? $viewer_height : '600px';
			
			// Generate unique ID for this module instance
			$module_id = sprintf( 'dicm-pdf-%s', uniqid() );
			
			// Build PDF parameters
			$pdf_params = array();
			if ( 'off' === $enable_toolbar ) {
				$pdf_params[] = 'toolbar=0';
			}
			if ( 'off' === $enable_navigation ) {
				$pdf_params[] = 'navpanes=0';
			} else {
				$pdf_params[] = 'navpanes=1';
			}
			if ( 'off' === $enable_scrollbar ) {
				$pdf_params[] = 'scrollbar=0';
			} else {
				$pdf_params[] = 'scrollbar=1';
			}
			
			$pdf_url_with_params = esc_url( $pdf_file );
			if ( ! empty( $pdf_params ) ) {
				$pdf_url_with_params .= '#' . implode( '&', $pdf_params );
			}
			
			$output .= sprintf(
				'<div class="dicm-pdf-viewer" style="height: %s;">',
				esc_attr( $height )
			);
			
			// Use iframe for better PDF support with fallback
			$output .= sprintf(
				'<iframe id="%s" src="%s" width="100%%" height="100%%" frameborder="0" allowfullscreen title="PDF Viewer">
					<object data="%s" type="application/pdf" width="100%%" height="100%%">
						<embed src="%s" type="application/pdf" width="100%%" height="100%%" />
						<p>Your browser does not support PDFs. <a href="%s" %s>Download the PDF</a>.</p>
					</object>
				</iframe>',
				esc_attr( $module_id ),
				esc_url( $pdf_url_with_params ),
				esc_url( $pdf_url_with_params ),
				esc_url( $pdf_url_with_params ),
				esc_url( $pdf_file ),
				( 'on' === $open_in_new_tab ) ? 'target="_blank" rel="noopener"' : ''
			);
			
			$output .= '</div>';
		}

		// Add download button/link
		if ( 'embed' !== $display_mode && ( 'on' === $show_download_button || 'download' === $display_mode ) ) {
			$button_text = ! empty( $download_button_text ) ? $download_button_text : 'Download PDF';
			$target = ( 'on' === $open_in_new_tab ) ? ' target="_blank" rel="noopener"' : '';
			
			$output .= sprintf(
				'<div class="dicm-pdf-download">
					<a href="%s" class="dicm-pdf-download-button"%s download>%s</a>
				</div>',
				esc_url( $pdf_file ),
				$target,
				esc_html( $button_text )
			);
		}

		$output .= '</div>';

		return $output;
	}
}

new DICM_PdfViewer;
