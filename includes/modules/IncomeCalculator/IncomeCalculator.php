<?php

class DICM_IncomeCalculator extends ET_Builder_Module {

	public $slug       = 'dicm_income_calculator';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://example.com',
		'author'     => 'Divi Custom Modules',
		'author_uri' => 'https://example.com',
	);

	public function init() {
		$this->name = esc_html__( 'Income Calculator', 'dicm-divi-custom-modules' );
		$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';

		$this->settings_modal_toggles = array(
			'general'  => array(
				'toggles' => array(
					'main_content' => esc_html__( 'Calculator Settings', 'dicm-divi-custom-modules' ),
					'row_configuration' => esc_html__( 'Row Configuration', 'dicm-divi-custom-modules' ),
					'ranges'       => esc_html__( 'Transaction Ranges', 'dicm-divi-custom-modules' ),
					'shares'       => esc_html__( 'Share Percentages', 'dicm-divi-custom-modules' ),
				),
			),
			'advanced' => array(
				'toggles' => array(
					'table_styling' => esc_html__( 'Table Styling', 'dicm-divi-custom-modules' ),
					'header_styling' => esc_html__( 'Header Styling', 'dicm-divi-custom-modules' ),
					'content_styling' => esc_html__( 'Content Styling', 'dicm-divi-custom-modules' ),
				),
			),
		);

		$this->advanced_fields = array(
			'fonts' => array(
				'header' => array(
					'label'    => esc_html__( 'Header', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-income-table th",
					),
				),
				'content' => array(
					'label'    => esc_html__( 'Content', 'dicm-divi-custom-modules' ),
					'css'      => array(
						'main' => "%%order_class%% .dicm-income-table td",
					),
				),
			),
			'background' => array(
				'use_background_color' => 'fields_only',
			),
			'borders' => array(
				'default' => array(
					'css' => array(
						'main' => array(
							'border_radii'  => "%%order_class%% .dicm-income-table",
							'border_styles' => "%%order_class%% .dicm-income-table",
						),
					),
				),
			),
			'box_shadow' => array(
				'default' => array(
					'css' => array(
						'main' => "%%order_class%% .dicm-income-table",
					),
				),
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
			'fee_amount' => array(
				'label'           => esc_html__( 'Fee Amount', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Enter the fee amount (e.g., $3.50)', 'dicm-divi-custom-modules' ),
				'default'         => '$3.50',
				'toggle_slug'     => 'main_content',
			),
			'income_title' => array(
				'label'           => esc_html__( 'Income Column Title', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Customize the income column header. Use {fee_amount} to display the fee dynamically.', 'dicm-divi-custom-modules' ),
				'default'         => 'INCOME EXPECTATIONS @ {fee_amount} FEE',
				'toggle_slug'     => 'main_content',
			),
			'enable_row_1' => array(
				'label'        => esc_html__( 'Enable Row 1', 'dicm-divi-custom-modules' ),
				'type'         => 'yes_no_button',
				'options'      => array(
					'off' => esc_html__( 'Disabled', 'dicm-divi-custom-modules' ),
					'on'  => esc_html__( 'Enabled', 'dicm-divi-custom-modules' ),
				),
				'default'      => 'on',
				'toggle_slug'  => 'row_configuration',
			),
			'enable_row_2' => array(
				'label'        => esc_html__( 'Enable Row 2', 'dicm-divi-custom-modules' ),
				'type'         => 'yes_no_button',
				'options'      => array(
					'off' => esc_html__( 'Disabled', 'dicm-divi-custom-modules' ),
					'on'  => esc_html__( 'Enabled', 'dicm-divi-custom-modules' ),
				),
				'default'      => 'on',
				'toggle_slug'  => 'row_configuration',
			),
			'enable_row_3' => array(
				'label'        => esc_html__( 'Enable Row 3', 'dicm-divi-custom-modules' ),
				'type'         => 'yes_no_button',
				'options'      => array(
					'off' => esc_html__( 'Disabled', 'dicm-divi-custom-modules' ),
					'on'  => esc_html__( 'Enabled', 'dicm-divi-custom-modules' ),
				),
				'default'      => 'on',
				'toggle_slug'  => 'row_configuration',
			),
			'enable_row_4' => array(
				'label'        => esc_html__( 'Enable Row 4', 'dicm-divi-custom-modules' ),
				'type'         => 'yes_no_button',
				'options'      => array(
					'off' => esc_html__( 'Disabled', 'dicm-divi-custom-modules' ),
					'on'  => esc_html__( 'Enabled', 'dicm-divi-custom-modules' ),
				),
				'default'      => 'on',
				'toggle_slug'  => 'row_configuration',
			),
			'enable_row_5' => array(
				'label'        => esc_html__( 'Enable Row 5', 'dicm-divi-custom-modules' ),
				'type'         => 'yes_no_button',
				'options'      => array(
					'off' => esc_html__( 'Disabled', 'dicm-divi-custom-modules' ),
					'on'  => esc_html__( 'Enabled', 'dicm-divi-custom-modules' ),
				),
				'default'      => 'on',
				'toggle_slug'  => 'row_configuration',
			),
			'range_1' => array(
				'label'           => esc_html__( 'Transaction Range 1', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'First transaction range (e.g., 1-100)', 'dicm-divi-custom-modules' ),
				'default'         => '1-100',
				'toggle_slug'     => 'ranges',
				'show_if'         => array(
					'enable_row_1' => 'on',
				),
			),
			'range_2' => array(
				'label'           => esc_html__( 'Transaction Range 2', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Second transaction range (e.g., 100-150)', 'dicm-divi-custom-modules' ),
				'default'         => '100-150',
				'toggle_slug'     => 'ranges',
				'show_if'         => array(
					'enable_row_2' => 'on',
				),
			),
			'range_3' => array(
				'label'           => esc_html__( 'Transaction Range 3', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Third transaction range (e.g., 150-250)', 'dicm-divi-custom-modules' ),
				'default'         => '150-250',
				'toggle_slug'     => 'ranges',
				'show_if'         => array(
					'enable_row_3' => 'on',
				),
			),
			'range_4' => array(
				'label'           => esc_html__( 'Transaction Range 4', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Fourth transaction range (e.g., 250+)', 'dicm-divi-custom-modules' ),
				'default'         => '250+',
				'toggle_slug'     => 'ranges',
				'show_if'         => array(
					'enable_row_4' => 'on',
				),
			),
			'range_5' => array(
				'label'           => esc_html__( 'Transaction Range 5', 'dicm-divi-custom-modules' ),
				'type'            => 'text',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Fifth transaction range (e.g., 300+)', 'dicm-divi-custom-modules' ),
				'default'         => '300+',
				'toggle_slug'     => 'ranges',
				'show_if'         => array(
					'enable_row_5' => 'on',
				),
			),
			'our_share_1' => array(
				'label'           => esc_html__( 'Our Share 1', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => array(
					'20' => '20%',
					'25' => '25%',
					'30' => '30%',
					'35' => '35%',
					'40' => '40%',
					'45' => '45%',
					'50' => '50%',
					'55' => '55%',
					'60' => '60%',
					'65' => '65%',
					'70' => '70%',
					'75' => '75%',
					'80' => '80%',
					'85' => '85%',
				),
				'default'         => '25',
				'toggle_slug'     => 'shares',
				'show_if'         => array(
					'enable_row_1' => 'on',
				),
			),
			'our_share_2' => array(
				'label'           => esc_html__( 'Our Share 2', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => array(
					'20' => '20%',
					'25' => '25%',
					'30' => '30%',
					'35' => '35%',
					'40' => '40%',
					'45' => '45%',
					'50' => '50%',
					'55' => '55%',
					'60' => '60%',
					'65' => '65%',
					'70' => '70%',
					'75' => '75%',
					'80' => '80%',
					'85' => '85%',
				),
				'default'         => '30',
				'toggle_slug'     => 'shares',
				'show_if'         => array(
					'enable_row_2' => 'on',
				),
			),
			'our_share_3' => array(
				'label'           => esc_html__( 'Our Share 3', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => array(
					'20' => '20%',
					'25' => '25%',
					'30' => '30%',
					'35' => '35%',
					'40' => '40%',
					'45' => '45%',
					'50' => '50%',
					'55' => '55%',
					'60' => '60%',
					'65' => '65%',
					'70' => '70%',
					'75' => '75%',
					'80' => '80%',
					'85' => '85%',
				),
				'default'         => '35',
				'toggle_slug'     => 'shares',
				'show_if'         => array(
					'enable_row_3' => 'on',
				),
			),
			'our_share_4' => array(
				'label'           => esc_html__( 'Our Share 4', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => array(
					'20' => '20%',
					'25' => '25%',
					'30' => '30%',
					'35' => '35%',
					'40' => '40%',
					'45' => '45%',
					'50' => '50%',
					'55' => '55%',
					'60' => '60%',
					'65' => '65%',
					'70' => '70%',
					'75' => '75%',
					'80' => '80%',
					'85' => '85%',
				),
				'default'         => '50',
				'toggle_slug'     => 'shares',
				'show_if'         => array(
					'enable_row_4' => 'on',
				),
			),
			'our_share_5' => array(
				'label'           => esc_html__( 'Our Share 5', 'dicm-divi-custom-modules' ),
				'type'            => 'select',
				'option_category' => 'basic_option',
				'options'         => array(
					'20' => '20%',
					'25' => '25%',
					'30' => '30%',
					'35' => '35%',
					'40' => '40%',
					'45' => '45%',
					'50' => '50%',
					'55' => '55%',
					'60' => '60%',
					'65' => '65%',
					'70' => '70%',
					'75' => '75%',
					'80' => '80%',
					'85' => '85%',
				),
				'default'         => '60',
				'toggle_slug'     => 'shares',
				'show_if'         => array(
					'enable_row_5' => 'on',
				),
			),
			'table_bg_color' => array(
				'label'        => esc_html__( 'Table Background Color', 'dicm-divi-custom-modules' ),
				'type'         => 'color-alpha',
				'custom_color' => true,
				'default'      => '#ffffff',
				'toggle_slug'  => 'table_styling',
			),
			'header_bg_color' => array(
				'label'        => esc_html__( 'Header Background Color', 'dicm-divi-custom-modules' ),
				'type'         => 'color-alpha',
				'custom_color' => true,
				'default'      => '#f8f9fa',
				'toggle_slug'  => 'header_styling',
			),
			'header_text_color' => array(
				'label'        => esc_html__( 'Header Text Color', 'dicm-divi-custom-modules' ),
				'type'         => 'color-alpha',
				'custom_color' => true,
				'default'      => '#333333',
				'toggle_slug'  => 'header_styling',
			),
			'content_bg_color' => array(
				'label'        => esc_html__( 'Content Background Color', 'dicm-divi-custom-modules' ),
				'type'         => 'color-alpha',
				'custom_color' => true,
				'default'      => '#ffffff',
				'toggle_slug'  => 'content_styling',
			),
			'content_text_color' => array(
				'label'        => esc_html__( 'Content Text Color', 'dicm-divi-custom-modules' ),
				'type'         => 'color-alpha',
				'custom_color' => true,
				'default'      => '#333333',
				'toggle_slug'  => 'content_styling',
			),
			'highlight_column' => array(
				'label'        => esc_html__( 'Highlight "Your Share" Column', 'dicm-divi-custom-modules' ),
				'type'         => 'yes_no_button',
				'options'      => array(
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
				),
				'default'      => 'on',
				'toggle_slug'  => 'content_styling',
			),
			'highlight_color' => array(
				'label'        => esc_html__( 'Highlight Color', 'dicm-divi-custom-modules' ),
				'type'         => 'color-alpha',
				'custom_color' => true,
				'default'      => '#4a69bd',
				'show_if'      => array(
					'highlight_column' => 'on',
				),
				'toggle_slug'  => 'content_styling',
			),
		);
	}

	private function parse_transaction_range( $range ) {
		$range = trim( $range );
		
		if ( strpos( $range, '+' ) !== false ) {
			// Handle "250+" format
			$min = intval( str_replace( '+', '', $range ) );
			$max = $min + 250; // reasonable assumption for calculation
			return ( $min + $max ) / 2;
		} elseif ( strpos( $range, '-' ) !== false ) {
			// Handle "1-100" format
			$parts = explode( '-', $range );
			if ( count( $parts ) >= 2 ) {
				$min = intval( trim( $parts[0] ) );
				$max = intval( trim( $parts[1] ) );
				return ( $min + $max ) / 2;
			}
		}
		
		return intval( $range ); // single number
	}

	private function get_range_limits( $range ) {
		$range = trim( $range );
		
		if ( strpos( $range, '+' ) !== false ) {
			// Handle "250+" format
			$min = intval( str_replace( '+', '', $range ) );
			$max = $min + 500; // reasonable upper limit for "+" ranges
			return array( 'min' => $min, 'max' => $max );
		} elseif ( strpos( $range, '-' ) !== false ) {
			// Handle "1-100" format
			$parts = explode( '-', $range );
			if ( count( $parts ) >= 2 ) {
				$min = intval( trim( $parts[0] ) );
				$max = intval( trim( $parts[1] ) );
				return array( 'min' => $min, 'max' => $max );
			}
		}
		
		// Single number - allow some flexibility around it
		$single = intval( $range );
		return array( 'min' => max( 1, $single - 10 ), 'max' => $single + 10 );
	}

	private function parse_fee_amount( $fee_string ) {
		// Extract numeric value from fee string like "$3.50"
		$numeric = preg_replace( '/[^0-9.]/', '', $fee_string );
		return floatval( $numeric );
	}

	private function calculate_income( $transaction_count, $fee, $share_percent ) {
		return $transaction_count * $fee * ( $share_percent / 100 );
	}

	private function format_currency( $amount ) {
		return '$' . number_format( $amount, 0 );
	}

	public function render( $attrs, $content, $render_slug ) {
		$fee = $this->parse_fee_amount( $this->props['fee_amount'] );
		
		// Build table data
		$rows = array();
		for ( $i = 1; $i <= 5; $i++ ) {
			// Only process enabled rows
			if ( isset( $this->props["enable_row_{$i}"] ) && $this->props["enable_row_{$i}"] === 'on' ) {
				$range = $this->props["range_{$i}"];
				$our_share = intval( $this->props["our_share_{$i}"] );
				$your_share = 100 - $our_share;
				
				$transaction_count = $this->parse_transaction_range( $range );
				$income = $this->calculate_income( $transaction_count, $fee, $your_share );
				
				$rows[] = array(
					'range' => $range,
					'our_share' => $our_share . '%',
					'your_share' => $your_share . '%',
					'income' => $this->format_currency( $income ),
					'transaction_count' => $transaction_count,
					'row_id' => $i, // Keep track of original row ID
				);
			}
		}

		// Generate CSS for styling
		$styles = array();
		
		if ( ! empty( $this->props['table_bg_color'] ) ) {
			$styles[] = sprintf( '.dicm-income-table { background-color: %s; }', esc_attr( $this->props['table_bg_color'] ) );
		}
		
		if ( ! empty( $this->props['header_bg_color'] ) ) {
			$styles[] = sprintf( '.dicm-income-table th { background-color: %s; }', esc_attr( $this->props['header_bg_color'] ) );
		}
		
		if ( ! empty( $this->props['header_text_color'] ) ) {
			$styles[] = sprintf( '.dicm-income-table th { color: %s; }', esc_attr( $this->props['header_text_color'] ) );
		}
		
		if ( ! empty( $this->props['content_bg_color'] ) ) {
			$styles[] = sprintf( '.dicm-income-table td { background-color: %s; }', esc_attr( $this->props['content_bg_color'] ) );
		}
		
		if ( ! empty( $this->props['content_text_color'] ) ) {
			$styles[] = sprintf( '.dicm-income-table td { color: %s; }', esc_attr( $this->props['content_text_color'] ) );
		}

		// Highlight "Your Share" column if enabled
		$highlight_class = '';
		if ( $this->props['highlight_column'] === 'on' ) {
			$highlight_class = 'dicm-highlight-column';
			if ( ! empty( $this->props['highlight_color'] ) ) {
				$styles[] = sprintf( '.dicm-income-table .dicm-your-share-header, .dicm-income-table .dicm-your-share-cell { background-color: %s; color: white; }', esc_attr( $this->props['highlight_color'] ) );
			}
		}

		$inline_styles = ! empty( $styles ) ? sprintf( '<style>%s %s</style>', esc_attr( "#{$this->slug}_{$this->shortcode_atts['module_id']}" ), implode( ' ', $styles ) ) : '';

		// Generate unique ID for this module instance
		$module_id = 'dicm_income_calc_' . uniqid();
		$fee_numeric = $fee;

		// Process income title with placeholder replacement
		$income_title = $this->props['income_title'];
		$income_title = str_replace( '{fee_amount}', $this->props['fee_amount'], $income_title );

		$output = sprintf(
			'%s
			<div class="dicm-income-calculator-wrapper" id="%s">
				<table class="dicm-income-table %s">
					<thead>
						<tr>
							<th class="dicm-transactions-header">%s</th>
							<th class="dicm-our-share-header">%s</th>
							<th class="dicm-your-share-header">%s</th>
							<th class="dicm-income-header">%s</th>
						</tr>
					</thead>
					<tbody>',
			$inline_styles,
			$module_id,
			$highlight_class,
			esc_html__( 'TRANSACTIONS', 'dicm-divi-custom-modules' ),
			esc_html__( 'OUR SHARE', 'dicm-divi-custom-modules' ),
			esc_html__( 'YOUR SHARE', 'dicm-divi-custom-modules' ),
			esc_html( $income_title )
		);

		foreach ( $rows as $index => $row ) {
			$row_id = $row['row_id']; // Use the original row ID
			$range_limits = $this->get_range_limits( $this->props["range_{$row_id}"] );
			
			$output .= sprintf(
				'<tr>
					<td class="dicm-transactions-cell">
						<span class="dicm-range-label">%s</span>
						<input type="number" 
							   class="dicm-transaction-input" 
							   data-row="%d" 
							   data-our-share="%d" 
							   data-fee="%s" 
							   value="%d" 
							   min="%d" 
							   max="%d"
							   title="Enter between %d and %d transactions"
							   placeholder="Enter transactions"/>
					</td>
					<td class="dicm-our-share-cell">%s</td>
					<td class="dicm-your-share-cell">%s</td>
					<td class="dicm-income-cell">
						<span class="dicm-income-value" id="income_%s_%d">%s</span>
					</td>
				</tr>',
				esc_html( $row['range'] ),
				$row_id,
				intval( $this->props["our_share_{$row_id}"] ),
				$fee_numeric,
				intval( $row['transaction_count'] ),
				$range_limits['min'],
				$range_limits['max'],
				$range_limits['min'],
				$range_limits['max'],
				esc_html( $row['our_share'] ),
				esc_html( $row['your_share'] ),
				$module_id,
				$row_id,
				esc_html( $row['income'] )
			);
		}

		$output .= '
					</tbody>
				</table>
				<script>
				(function() {
					const moduleId = "' . $module_id . '";
					const inputs = document.querySelectorAll("#" + moduleId + " .dicm-transaction-input");
					
					inputs.forEach(function(input) {
						// Enhanced input event handler with auto-clamping
						input.addEventListener("input", function() {
							setTimeout(() => {
								this.disabled = true; // Disable input for 1.7 seconds
								const ourShare = parseInt(this.dataset.ourShare);
								const fee = parseFloat(this.dataset.fee);
								const row = this.dataset.row;
								const min = parseInt(this.min);
								const max = parseInt(this.max);
								
								// Update input if value was clamped
								let transactions = parseInt(this.value) || 0;
								// Auto-clamp value to valid range
								const originalValue = transactions;
								transactions = Math.max(min, Math.min(max, transactions));

								if (originalValue !== transactions && this.value !== "" && this.value !== "0") {
									this.value = transactions;
									
									// this.select(); // Select text for easy replacement
									// Show auto-correction feedback
									this.classList.add("dicm-auto-corrected");
									setTimeout(() => this.classList.remove("dicm-auto-corrected"), 1200);
								}
								
								// Always valid since we auto-clamp
								this.classList.remove("dicm-input-error");
								
								// Calculate income with clamped value using Your Share
								const yourShare = 100 - ourShare;
								const income = transactions * fee * (yourShare / 100);
								const incomeElement = document.getElementById("income_" + moduleId + "_" + row);
								
								if (incomeElement) {
									incomeElement.textContent = "$" + Math.round(income).toLocaleString();
									incomeElement.classList.add("dicm-updated");
									incomeElement.classList.remove("dicm-income-error");
									
									setTimeout(function() {
										incomeElement.classList.remove("dicm-updated");
									}, 600);
								}
								
								// Remove any warning messages since we auto-correct
								let warning = this.parentNode.querySelector(".dicm-range-warning");
								if (warning) {
									warning.style.display = "none";
								}
								
								// Re-enable input after processing
								setTimeout(() => this.disabled = false, 1700);
							}, 1700);
						});
						
						// Handle paste events to prevent invalid pasted values
						input.addEventListener("paste", function(e) {
							const self = this;
							setTimeout(function() {
								const min = parseInt(self.min);
								const max = parseInt(self.max);
								let value = parseInt(self.value) || 0;
								
								// Clamp pasted value
								const clampedValue = Math.max(min, Math.min(max, value));
								if (value !== clampedValue) {
									self.value = clampedValue;
									self.select();
									self.classList.add("dicm-auto-corrected");
									setTimeout(() => self.classList.remove("dicm-auto-corrected"), 1000);
									
									// Trigger input event to update calculations
									self.dispatchEvent(new Event("input"));
								}
							}, 10);
						});
						
						// Remove blur validation since we auto-clamp on input
						input.addEventListener("blur", function() {
							// Remove any warning messages
							let warning = this.parentNode.querySelector(".dicm-range-warning");
							if (warning) {
								warning.style.display = "none";
							}
						});
					});
				})();
				</script>
			</div>';

		return $output;
	}
}

new DICM_IncomeCalculator;
