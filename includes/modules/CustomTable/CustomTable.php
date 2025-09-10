<?php

class DICM_CustomTable extends ET_Builder_Module {

	public $slug       = 'dicm_custom_table';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'MDM - Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'Custom Table', 'dicm-divi-custom-modules' );
		$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';
		
		// Enable advanced fields
		$this->advanced_fields = array(
			'borders'               => array(
				'default' => array(
					'css' => array(
						'main' => array(
							'border_radii'  => "%%order_class%% .dicm-custom-table",
							'border_styles' => "%%order_class%% .dicm-custom-table",
						),
					),
				),
			),
			'box_shadow'            => array(
				'default' => array(
					'css' => array(
						'main' => '%%order_class%% .dicm-custom-table',
					),
				),
			),
			'margin_padding' => array(
				'css' => array(
					'important' => 'all',
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
		$fields = array(
			// Basic table settings
			'table_columns' => array(
				'label'           => esc_html__( 'Number of Columns', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => array(
					'1' => esc_html__( '1 Column', 'dicm-divi-custom-modules' ),
					'2' => esc_html__( '2 Columns', 'dicm-divi-custom-modules' ),
					'3' => esc_html__( '3 Columns', 'dicm-divi-custom-modules' ),
					'4' => esc_html__( '4 Columns', 'dicm-divi-custom-modules' ),
					'5' => esc_html__( '5 Columns', 'dicm-divi-custom-modules' ),
				),
				'default'         => '3',
				'description'     => esc_html__( 'Choose the number of columns for your table.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'table_structure',
			),
			'table_rows' => array(
				'label'           => esc_html__( 'Number of Rows', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => array(
					'1' => esc_html__( '1 Row', 'dicm-divi-custom-modules' ),
					'2' => esc_html__( '2 Rows', 'dicm-divi-custom-modules' ),
					'3' => esc_html__( '3 Rows', 'dicm-divi-custom-modules' ),
					'4' => esc_html__( '4 Rows', 'dicm-divi-custom-modules' ),
					'5' => esc_html__( '5 Rows', 'dicm-divi-custom-modules' ),
					'6' => esc_html__( '6 Rows', 'dicm-divi-custom-modules' ),
				),
				'default'         => '3',
				'description'     => esc_html__( 'Choose the number of rows for your table (excluding header).', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'table_structure',
			),
			'table_style' => array(
				'label'           => esc_html__( 'Table Style', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'layout',
				'options'         => array(
					'default'   => esc_html__( 'Default', 'dicm-divi-custom-modules' ),
					'striped'   => esc_html__( 'Striped Rows', 'dicm-divi-custom-modules' ),
					'bordered'  => esc_html__( 'Bordered', 'dicm-divi-custom-modules' ),
					'minimal'   => esc_html__( 'Minimal', 'dicm-divi-custom-modules' ),
				),
				'default'         => 'default',
				'description'     => esc_html__( 'Choose a predefined style for your table.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'table_structure',
			),

			// Header styling
			'header_bg_color' => array(
				'label'           => esc_html__( 'Header Background Color', 'dicm-divi-custom-modules' ),
				'type'            => 'color-alpha',
				'option_category' => 'color_option',
				'default'         => '#f8f9fa',
				'description'     => esc_html__( 'Choose the background color for table headers.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'header_styling',
			),
			'header_font_family' => array(
				'label'           => esc_html__( 'Header Font Family', 'dicm-divi-custom-modules' ),
				'type'            => 'font',
				'option_category' => 'font_option',
				'description'     => esc_html__( 'Choose the font family for table headers.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'header_styling',
			),
			'header_font_size' => array(
				'label'           => esc_html__( 'Header Font Size', 'dicm-divi-custom-modules' ),
				'type'            => 'range',
				'option_category' => 'font_option',
				'default'         => '16px',
				'range_settings'  => array(
					'min'  => '10',
					'max'  => '32',
					'step' => '1',
				),
				'description'     => esc_html__( 'Choose the font size for table headers.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'header_styling',
			),
			'header_font_color' => array(
				'label'           => esc_html__( 'Header Font Color', 'dicm-divi-custom-modules' ),
				'type'            => 'color-alpha',
				'option_category' => 'color_option',
				'default'         => '#333333',
				'description'     => esc_html__( 'Choose the font color for table headers.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'header_styling',
			),
			'header_font_weight' => array(
				'label'           => esc_html__( 'Header Font Weight', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'font_option',
				'options'         => array(
					'300' => esc_html__( 'Light', 'dicm-divi-custom-modules' ),
					'400' => esc_html__( 'Normal', 'dicm-divi-custom-modules' ),
					'500' => esc_html__( 'Medium', 'dicm-divi-custom-modules' ),
					'600' => esc_html__( 'Semi Bold', 'dicm-divi-custom-modules' ),
					'700' => esc_html__( 'Bold', 'dicm-divi-custom-modules' ),
					'800' => esc_html__( 'Extra Bold', 'dicm-divi-custom-modules' ),
				),
				'default'         => '600',
				'description'     => esc_html__( 'Choose the font weight for table headers.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'header_styling',
			),
		);

		// Add header content fields
		for ( $i = 1; $i <= 5; $i++ ) {
			$fields["header_col_{$i}"] = array(
				'label'           => sprintf( esc_html__( 'Header Column %d', 'dicm-divi-custom-modules' ), $i ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => sprintf( esc_html__( 'Enter the text for header column %d.', 'dicm-divi-custom-modules' ), $i ),
				'toggle_slug'     => 'table_content',
				'show_if'         => array(
					'table_columns' => array( $i, '5' ), // Show if columns >= $i
				),
			);
			
			// Adjust show_if for each column
			if ( $i == 1 ) {
				$fields["header_col_{$i}"]['show_if']['table_columns'] = array( '1', '2', '3', '4', '5' );
			} elseif ( $i == 2 ) {
				$fields["header_col_{$i}"]['show_if']['table_columns'] = array( '2', '3', '4', '5' );
			} elseif ( $i == 3 ) {
				$fields["header_col_{$i}"]['show_if']['table_columns'] = array( '3', '4', '5' );
			} elseif ( $i == 4 ) {
				$fields["header_col_{$i}"]['show_if']['table_columns'] = array( '4', '5' );
			} elseif ( $i == 5 ) {
				$fields["header_col_{$i}"]['show_if']['table_columns'] = array( '5' );
			}
		}

		// Add individual column header styling fields
		for ( $col = 1; $col <= 5; $col++ ) {
			$fields["header_col_{$col}_bg_color"] = array(
				'label'           => sprintf( esc_html__( 'Header Column %d Background Color', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'color-alpha',
				'option_category' => 'color_option',
				'description'     => sprintf( esc_html__( 'Choose the background color for header column %d. Leave empty to use general header styling.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "header_col_{$col}_styling",
			);
			$fields["header_col_{$col}_font_family"] = array(
				'label'           => sprintf( esc_html__( 'Header Column %d Font Family', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'font',
				'option_category' => 'font_option',
				'description'     => sprintf( esc_html__( 'Choose the font family for header column %d. Leave empty to use general header styling.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "header_col_{$col}_styling",
			);
			$fields["header_col_{$col}_font_size"] = array(
				'label'           => sprintf( esc_html__( 'Header Column %d Font Size', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'range',
				'option_category' => 'font_option',
				'range_settings'  => array(
					'min'  => '10',
					'max'  => '32',
					'step' => '1',
				),
				'description'     => sprintf( esc_html__( 'Choose the font size for header column %d. Leave empty to use general header styling.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "header_col_{$col}_styling",
			);
			$fields["header_col_{$col}_font_color"] = array(
				'label'           => sprintf( esc_html__( 'Header Column %d Font Color', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'color-alpha',
				'option_category' => 'color_option',
				'description'     => sprintf( esc_html__( 'Choose the font color for header column %d. Leave empty to use general header styling.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "header_col_{$col}_styling",
			);
			$fields["header_col_{$col}_font_weight"] = array(
				'label'           => sprintf( esc_html__( 'Header Column %d Font Weight', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'select',
				'option_category' => 'font_option',
				'options'         => array(
					''    => esc_html__( 'Use General Header Style', 'dicm-divi-custom-modules' ),
					'300' => esc_html__( 'Light', 'dicm-divi-custom-modules' ),
					'400' => esc_html__( 'Normal', 'dicm-divi-custom-modules' ),
					'500' => esc_html__( 'Medium', 'dicm-divi-custom-modules' ),
					'600' => esc_html__( 'Semi Bold', 'dicm-divi-custom-modules' ),
					'700' => esc_html__( 'Bold', 'dicm-divi-custom-modules' ),
					'800' => esc_html__( 'Extra Bold', 'dicm-divi-custom-modules' ),
				),
				'description'     => sprintf( esc_html__( 'Choose the font weight for header column %d. Leave empty to use general header styling.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "header_col_{$col}_styling",
			);

			// Set show_if conditions for individual column header styling
			$show_conditions = array();
			for ( $c = $col; $c <= 5; $c++ ) {
				$show_conditions[] = (string) $c;
			}
			
			foreach ( array( 'bg_color', 'font_family', 'font_size', 'font_color', 'font_weight' ) as $property ) {
				$fields["header_col_{$col}_{$property}"]['show_if'] = array(
					'table_columns' => $show_conditions,
				);
			}
		}

		// Add column styling fields
		for ( $col = 1; $col <= 5; $col++ ) {
			$fields["col_{$col}_bg_color"] = array(
				'label'           => sprintf( esc_html__( 'Column %d Background Color', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'color-alpha',
				'option_category' => 'color_option',
				'default'         => '#ffffff',
				'description'     => sprintf( esc_html__( 'Choose the background color for column %d.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "col_{$col}_styling",
			);
			$fields["col_{$col}_font_family"] = array(
				'label'           => sprintf( esc_html__( 'Column %d Font Family', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'font',
				'option_category' => 'font_option',
				'description'     => sprintf( esc_html__( 'Choose the font family for column %d.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "col_{$col}_styling",
			);
			$fields["col_{$col}_font_size"] = array(
				'label'           => sprintf( esc_html__( 'Column %d Font Size', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'range',
				'option_category' => 'font_option',
				'default'         => '14px',
				'range_settings'  => array(
					'min'  => '10',
					'max'  => '24',
					'step' => '1',
				),
				'description'     => sprintf( esc_html__( 'Choose the font size for column %d.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "col_{$col}_styling",
			);
			$fields["col_{$col}_font_color"] = array(
				'label'           => sprintf( esc_html__( 'Column %d Font Color', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'color-alpha',
				'option_category' => 'color_option',
				'default'         => '#333333',
				'description'     => sprintf( esc_html__( 'Choose the font color for column %d.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "col_{$col}_styling",
			);
			$fields["col_{$col}_font_weight"] = array(
				'label'           => sprintf( esc_html__( 'Column %d Font Weight', 'dicm-divi-custom-modules' ), $col ),
				'type'            => 'select',
				'option_category' => 'font_option',
				'options'         => array(
					'300' => esc_html__( 'Light', 'dicm-divi-custom-modules' ),
					'400' => esc_html__( 'Normal', 'dicm-divi-custom-modules' ),
					'500' => esc_html__( 'Medium', 'dicm-divi-custom-modules' ),
					'600' => esc_html__( 'Semi Bold', 'dicm-divi-custom-modules' ),
					'700' => esc_html__( 'Bold', 'dicm-divi-custom-modules' ),
				),
				'default'         => '400',
				'description'     => sprintf( esc_html__( 'Choose the font weight for column %d.', 'dicm-divi-custom-modules' ), $col ),
				'toggle_slug'     => "col_{$col}_styling",
			);

			// Set show_if conditions for column styling
			$show_conditions = array();
			for ( $c = $col; $c <= 5; $c++ ) {
				$show_conditions[] = (string) $c;
			}
			
			foreach ( array( 'bg_color', 'font_family', 'font_size', 'font_color', 'font_weight' ) as $property ) {
				$fields["col_{$col}_{$property}"]['show_if'] = array(
					'table_columns' => $show_conditions,
				);
			}
		}

		// Add row content fields
		for ( $row = 1; $row <= 6; $row++ ) {
			for ( $col = 1; $col <= 5; $col++ ) {
				$fields["row_{$row}_col_{$col}"] = array(
					'label'           => sprintf( esc_html__( 'Row %d, Column %d', 'dicm-divi-custom-modules' ), $row, $col ),
					'type'            => 'text',
					'option_category' => 'basic_option',
					'description'     => sprintf( esc_html__( 'Enter the content for row %d, column %d.', 'dicm-divi-custom-modules' ), $row, $col ),
					'toggle_slug'     => 'table_content',
				);

				// Set complex show_if conditions
				$row_conditions = array();
				for ( $r = $row; $r <= 6; $r++ ) {
					$row_conditions[] = (string) $r;
				}
				
				$col_conditions = array();
				for ( $c = $col; $c <= 5; $c++ ) {
					$col_conditions[] = (string) $c;
				}

				$fields["row_{$row}_col_{$col}"]['show_if'] = array(
					'table_rows' => $row_conditions,
					'table_columns' => $col_conditions,
				);
			}
		}

		return $fields;
	}

	public function get_settings_modal_toggles() {
		$toggles = array(
			'general'  => array(
				'toggles' => array(
					'table_structure' => esc_html__( 'Table Structure', 'dicm-divi-custom-modules' ),
					'table_content'   => esc_html__( 'Table Content', 'dicm-divi-custom-modules' ),
					'header_styling'  => esc_html__( 'Header Styling', 'dicm-divi-custom-modules' ),
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

		// Add column styling toggles
		for ( $i = 1; $i <= 5; $i++ ) {
			$toggles['general']['toggles']["col_{$i}_styling"] = sprintf( esc_html__( 'Column %d Styling', 'dicm-divi-custom-modules' ), $i );
		}

		// Add individual column header styling toggles
		for ( $i = 1; $i <= 5; $i++ ) {
			$toggles['general']['toggles']["header_col_{$i}_styling"] = sprintf( esc_html__( 'Header Column %d Styling', 'dicm-divi-custom-modules' ), $i );
		}

		return $toggles;
	}

	public function render( $attrs, $content = null, $render_slug ) {
		$table_columns = $this->props['table_columns'];
		$table_rows    = $this->props['table_rows'];
		$table_style   = $this->props['table_style'];

		// Generate unique table ID
		$table_id = 'dicm-custom-table-' . uniqid();

		// Build the table
		$output = sprintf(
			'<div id="%s" class="dicm-custom-table dicm-table-%s">',
			esc_attr( $table_id ),
			esc_attr( $table_style )
		);

		$output .= '<table>';

		// Table header
		$output .= '<thead><tr>';
		for ( $col = 1; $col <= intval( $table_columns ); $col++ ) {
			$header_content = $this->props["header_col_{$col}"];
			$header_styles = $this->get_column_header_styles( $col );
			$output .= sprintf( 
				'<th class="dicm-table-header dicm-col-%d" style="%s">%s</th>', 
				$col, 
				esc_attr( $header_styles ),
				esc_html( $header_content ) 
			);
		}
		$output .= '</tr></thead>';

		// Table body
		$output .= '<tbody>';
		for ( $row = 1; $row <= intval( $table_rows ); $row++ ) {
			$output .= '<tr>';
			for ( $col = 1; $col <= intval( $table_columns ); $col++ ) {
				$cell_content = $this->props["row_{$row}_col_{$col}"];
				$cell_styles = $this->get_column_styles( $col );
				$output .= sprintf( 
					'<td class="dicm-table-cell dicm-col-%d" style="%s">%s</td>', 
					$col, 
					esc_attr( $cell_styles ),
					esc_html( $cell_content ) 
				);
			}
			$output .= '</tr>';
		}
		$output .= '</tbody>';

		$output .= '</table>';
		$output .= '</div>';

		return $output;
	}

	private function get_column_header_styles( $col ) {
		$styles = array();

		// Individual column header styles (priority)
		if ( ! empty( $this->props["header_col_{$col}_bg_color"] ) ) {
			$styles[] = sprintf( 'background-color: %s', esc_attr( $this->props["header_col_{$col}_bg_color"] ) );
		} elseif ( ! empty( $this->props['header_bg_color'] ) ) {
			// Fall back to general header style
			$styles[] = sprintf( 'background-color: %s', esc_attr( $this->props['header_bg_color'] ) );
		}

		if ( ! empty( $this->props["header_col_{$col}_font_family"] ) ) {
			$styles[] = sprintf( 'font-family: %s', esc_attr( $this->props["header_col_{$col}_font_family"] ) );
		} elseif ( ! empty( $this->props['header_font_family'] ) ) {
			$styles[] = sprintf( 'font-family: %s', esc_attr( $this->props['header_font_family'] ) );
		}

		if ( ! empty( $this->props["header_col_{$col}_font_size"] ) ) {
			$styles[] = sprintf( 'font-size: %s', esc_attr( $this->props["header_col_{$col}_font_size"] ) );
		} elseif ( ! empty( $this->props['header_font_size'] ) ) {
			$styles[] = sprintf( 'font-size: %s', esc_attr( $this->props['header_font_size'] ) );
		}

		if ( ! empty( $this->props["header_col_{$col}_font_color"] ) ) {
			$styles[] = sprintf( 'color: %s', esc_attr( $this->props["header_col_{$col}_font_color"] ) );
		} elseif ( ! empty( $this->props['header_font_color'] ) ) {
			$styles[] = sprintf( 'color: %s', esc_attr( $this->props['header_font_color'] ) );
		}

		if ( ! empty( $this->props["header_col_{$col}_font_weight"] ) ) {
			$styles[] = sprintf( 'font-weight: %s', esc_attr( $this->props["header_col_{$col}_font_weight"] ) );
		} elseif ( ! empty( $this->props['header_font_weight'] ) ) {
			$styles[] = sprintf( 'font-weight: %s', esc_attr( $this->props['header_font_weight'] ) );
		}

		return implode( '; ', $styles );
	}

	private function get_column_styles( $col ) {
		$styles = array();
		
		if ( ! empty( $this->props["col_{$col}_bg_color"] ) ) {
			$styles[] = sprintf( 'background-color: %s', esc_attr( $this->props["col_{$col}_bg_color"] ) );
		}
		if ( ! empty( $this->props["col_{$col}_font_family"] ) ) {
			$styles[] = sprintf( 'font-family: %s', esc_attr( $this->props["col_{$col}_font_family"] ) );
		}
		if ( ! empty( $this->props["col_{$col}_font_size"] ) ) {
			$styles[] = sprintf( 'font-size: %s', esc_attr( $this->props["col_{$col}_font_size"] ) );
		}
		if ( ! empty( $this->props["col_{$col}_font_color"] ) ) {
			$styles[] = sprintf( 'color: %s', esc_attr( $this->props["col_{$col}_font_color"] ) );
		}
		if ( ! empty( $this->props["col_{$col}_font_weight"] ) ) {
			$styles[] = sprintf( 'font-weight: %s', esc_attr( $this->props["col_{$col}_font_weight"] ) );
		}

		return implode( '; ', $styles );
	}
}

new DICM_CustomTable;
