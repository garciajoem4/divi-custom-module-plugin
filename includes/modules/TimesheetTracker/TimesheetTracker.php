<?php

class DICM_TimesheetTracker extends ET_Builder_Module {

	public $slug       = 'dicm_timesheet_tracker';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'MDM - Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'Timesheet Tracker', 'dicm-divi-custom-modules' );
		$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';
		
		$this->main_css_element = '%%order_class%%';
		
		// Enqueue frontend script for React initialization
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_scripts' ) );
		
		$this->settings_modal_toggles = array(
			'general'  => array(
				'toggles' => array(
					'main_content' => esc_html__( 'Table Settings', 'dicm-divi-custom-modules' ),
					'default_values' => esc_html__( 'Default Values', 'dicm-divi-custom-modules' ),
					'timer_settings' => esc_html__( 'Timer Settings', 'dicm-divi-custom-modules' ),
				),
			),
			'advanced' => array(
				'toggles' => array(
					'data_persistence' => esc_html__( 'Data Persistence', 'dicm-divi-custom-modules' ),
					'formatting' => esc_html__( 'Number Formatting', 'dicm-divi-custom-modules' ),
				),
			),
		);

		$this->advanced_fields = array(
			'fonts' => array(
				'header' => array(
					'label' => esc_html__( 'Header', 'dicm-divi-custom-modules' ),
					'css' => array(
						'main' => "%%order_class%% .timesheet-header th",
					),
					'toggle_slug' => 'header',
				),
				'body' => array(
					'label' => esc_html__( 'Table Body', 'dicm-divi-custom-modules' ),
					'css' => array(
						'main' => "%%order_class%% .timesheet-body td",
					),
					'toggle_slug' => 'body',
				),
				'timer' => array(
					'label' => esc_html__( 'Timer Display', 'dicm-divi-custom-modules' ),
					'css' => array(
						'main' => "%%order_class%% .timer-display",
					),
					'toggle_slug' => 'timer',
				),
			),
			'background' => array(
				'settings' => array(
					'color' => 'alpha',
				),
			),
			'borders' => array(
				'default' => array(),
				'table' => array(
					'css' => array(
						'main' => array(
							'border_radii' => "%%order_class%% .timesheet-table",
							'border_styles' => "%%order_class%% .timesheet-table",
						),
					),
					'label_prefix' => esc_html__( 'Table', 'dicm-divi-custom-modules' ),
					'toggle_slug' => 'borders',
				),
			),
			'box_shadow' => array(
				'default' => array(),
				'table' => array(
					'css' => array(
						'main' => "%%order_class%% .timesheet-table",
					),
					'label_prefix' => esc_html__( 'Table', 'dicm-divi-custom-modules' ),
					'toggle_slug' => 'box_shadow',
				),
			),
			'margin_padding' => array(
				'css' => array(
					'important' => 'all',
				),
			),
		);

		$this->custom_css_fields = array(
			'timesheet_table' => array(
				'label'    => esc_html__( 'Timesheet Table', 'dicm-divi-custom-modules' ),
				'selector' => '.timesheet-table',
			),
			'timer_controls' => array(
				'label'    => esc_html__( 'Timer Controls', 'dicm-divi-custom-modules' ),
				'selector' => '.timer-controls',
			),
			'table_row' => array(
				'label'    => esc_html__( 'Table Row', 'dicm-divi-custom-modules' ),
				'selector' => '.timesheet-row',
			),
		);
	}

	public function get_fields() {
		return array(
			// Table Settings
			'table_title' => array(
				'label' => esc_html__( 'Table Title', 'dicm-divi-custom-modules' ),
				'type' => 'text',
				'default' => 'Timesheet Tracker',
				'toggle_slug' => 'main_content',
				'description' => esc_html__( 'Enter the title for your timesheet table.', 'dicm-divi-custom-modules' ),
			),
			'show_timer' => array(
				'label' => esc_html__( 'Show Timer', 'dicm-divi-custom-modules' ),
				'type' => 'yes_no_button',
				'option_category' => 'basic_option',
				'options' => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default' => 'on',
				'toggle_slug' => 'main_content',
				'description' => esc_html__( 'Enable or disable the timer functionality.', 'dicm-divi-custom-modules' ),
			),
			'max_rows' => array(
				'label' => esc_html__( 'Maximum Rows', 'dicm-divi-custom-modules' ),
				'type' => 'range',
				'range_settings' => array(
					'min' => 5,
					'max' => 50,
					'step' => 1,
				),
				'default' => '10',
				'toggle_slug' => 'main_content',
				'description' => esc_html__( 'Set the maximum number of timesheet rows.', 'dicm-divi-custom-modules' ),
			),
			
			// Default Values
			'default_hourly_rate' => array(
				'label' => esc_html__( 'Default Hourly Rate', 'dicm-divi-custom-modules' ),
				'type' => 'text',
				'default' => '15.00',
				'toggle_slug' => 'default_values',
				'description' => esc_html__( 'Set the default hourly billing rate in USD (fixed at $15).', 'dicm-divi-custom-modules' ),
			),
			'default_project' => array(
				'label' => esc_html__( 'Default Project Name', 'dicm-divi-custom-modules' ),
				'type' => 'text',
				'default' => '',
				'toggle_slug' => 'default_values',
				'description' => esc_html__( 'Optional default project name for new entries.', 'dicm-divi-custom-modules' ),
			),
			'preset_tasks' => array(
				'label' => esc_html__( 'Preset Tasks', 'dicm-divi-custom-modules' ),
				'type' => 'textarea',
				'default' => "Development\nTesting\nDocumentation\nMeeting\nResearch",
				'toggle_slug' => 'default_values',
				'description' => esc_html__( 'Enter preset tasks (one per line) for quick selection.', 'dicm-divi-custom-modules' ),
			),
			
			// Timer Settings
			'timer_auto_start' => array(
				'label' => esc_html__( 'Auto-start Timer', 'dicm-divi-custom-modules' ),
				'type' => 'yes_no_button',
				'option_category' => 'basic_option',
				'options' => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default' => 'off',
				'toggle_slug' => 'timer_settings',
				'description' => esc_html__( 'Automatically start timer when adding new row.', 'dicm-divi-custom-modules' ),
				'show_if' => array(
					'show_timer' => 'on',
				),
			),
			'timer_sound' => array(
				'label' => esc_html__( 'Timer Sound Alerts', 'dicm-divi-custom-modules' ),
				'type' => 'yes_no_button',
				'option_category' => 'basic_option',
				'options' => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default' => 'off',
				'toggle_slug' => 'timer_settings',
				'description' => esc_html__( 'Play sound when starting/stopping timer.', 'dicm-divi-custom-modules' ),
				'show_if' => array(
					'show_timer' => 'on',
				),
			),
			
			// Data Persistence
			'save_data' => array(
				'label' => esc_html__( 'Save Data Locally', 'dicm-divi-custom-modules' ),
				'type' => 'yes_no_button',
				'option_category' => 'basic_option',
				'options' => array(
					'on'  => esc_html__( 'Yes', 'dicm-divi-custom-modules' ),
					'off' => esc_html__( 'No', 'dicm-divi-custom-modules' ),
				),
				'default' => 'on',
				'toggle_slug' => 'data_persistence',
				'description' => esc_html__( 'Save timesheet data in browser local storage.', 'dicm-divi-custom-modules' ),
			),
			'auto_save_interval' => array(
				'label' => esc_html__( 'Auto-save Interval (seconds)', 'dicm-divi-custom-modules' ),
				'type' => 'range',
				'range_settings' => array(
					'min' => 5,
					'max' => 60,
					'step' => 5,
				),
				'default' => '10',
				'toggle_slug' => 'data_persistence',
				'description' => esc_html__( 'How often to auto-save data (in seconds).', 'dicm-divi-custom-modules' ),
				'show_if' => array(
					'save_data' => 'on',
				),
			),
			
			// Number Formatting
			'decimal_places' => array(
				'label' => esc_html__( 'Decimal Places', 'dicm-divi-custom-modules' ),
				'type' => 'select',
				'option_category' => 'basic_option',
				'options' => array(
					'0' => esc_html__( '0', 'dicm-divi-custom-modules' ),
					'1' => esc_html__( '1', 'dicm-divi-custom-modules' ),
					'2' => esc_html__( '2', 'dicm-divi-custom-modules' ),
					'3' => esc_html__( '3', 'dicm-divi-custom-modules' ),
				),
				'default' => '2',
				'toggle_slug' => 'formatting',
				'description' => esc_html__( 'Number of decimal places for amounts.', 'dicm-divi-custom-modules' ),
			),
			'time_format' => array(
				'label' => esc_html__( 'Time Format', 'dicm-divi-custom-modules' ),
				'type' => 'select',
				'option_category' => 'basic_option',
				'options' => array(
					'decimal' => esc_html__( 'Decimal Hours (1.5)', 'dicm-divi-custom-modules' ),
					'hours_minutes' => esc_html__( 'Hours:Minutes (1:30)', 'dicm-divi-custom-modules' ),
				),
				'default' => 'decimal',
				'toggle_slug' => 'formatting',
				'description' => esc_html__( 'How to display time values.', 'dicm-divi-custom-modules' ),
			),
		);
	}

	/**
	 * Enqueue frontend scripts for TimesheetTracker React component
	 */
	public function enqueue_frontend_scripts() {
		// Enqueue the frontend bundle that includes React component initialization
		wp_enqueue_script(
			'dicm-frontend-bundle',
			plugin_dir_url( dirname( dirname( dirname( __FILE__ ) ) ) ) . 'scripts/frontend-bundle.min.js',
			array( 'react', 'react-dom' ),
			'1.0.0',
			true
		);
		
		// Also enqueue React dependencies for frontend
		wp_enqueue_script(
			'react',
			'https://unpkg.com/react@18/umd/react.production.min.js',
			array(),
			'18.3.1',
			true
		);
		
		wp_enqueue_script(
			'react-dom',
			'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
			array( 'react' ),
			'18.3.1',
			true
		);
	}

	public function render( $attrs, $content, $render_slug ) {
		$is_logged_in = is_user_logged_in();
		$current_user_id = $is_logged_in ? get_current_user_id() : 0;
		$table_title = $this->props['table_title'];
		$show_timer = $this->props['show_timer'];
		$max_rows = $this->props['max_rows'];
		$default_hourly_rate = $this->props['default_hourly_rate'];
		$default_project = $this->props['default_project'];
		$preset_tasks = $this->props['preset_tasks'];
		$decimal_places = $this->props['decimal_places'];
		$time_format = $this->props['time_format'];
		$save_data = $this->props['save_data'];
		$auto_save_interval = $this->props['auto_save_interval'];
		$timer_auto_start = $this->props['timer_auto_start'];
		$timer_sound = $this->props['timer_sound'];

		// Prepare preset tasks for JavaScript
		$preset_tasks_array = array_filter(array_map('trim', explode("\n", $preset_tasks)));
		$preset_tasks_json = wp_json_encode($preset_tasks_array);

		// Module configuration for JavaScript
		$config = array(
			'maxRows' => intval($max_rows),
			'defaultHourlyRate' => 15, // Fixed at $15
			'defaultProject' => $default_project,
			'presetTasks' => $preset_tasks_array,
			'currencySymbol' => '$', // USD currency
			'decimalPlaces' => intval($decimal_places),
			'timeFormat' => $time_format,
			'saveData' => $save_data === 'on' && $is_logged_in, // Only save if logged in
			'autoSaveInterval' => intval($auto_save_interval) * 1000, // Convert to milliseconds
			'timerAutoStart' => $timer_auto_start === 'on' && $is_logged_in, // Only for logged users
			'timerSound' => $timer_sound === 'on' && $is_logged_in, // Only for logged users
			'showTimer' => $show_timer === 'on' && $is_logged_in, // Only show timer to logged users
			// WordPress-specific configuration
			'userId' => $current_user_id,
			'isLoggedIn' => $is_logged_in,
			'viewOnly' => !$is_logged_in, // Add view-only flag
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonce' => wp_create_nonce( 'timesheet_tracker_nonce' ),
		);

		// Add login URL to config for React component
		$config['loginUrl'] = wp_login_url( get_permalink() );
		
		// Add user details for display
		if ($is_logged_in) {
			$current_user = wp_get_current_user();
			$last_login = get_user_meta($current_user_id, 'last_login', true);
			
			$config['userDetails'] = array(
				'name' => $current_user->display_name,
				'email' => $current_user->user_email,
				'lastLogin' => $last_login ? date('M j, Y g:i A', strtotime($last_login)) : 'First time login'
			);
		}
		
		$config_json = wp_json_encode($config);

		// Build minimal output - React will handle all content rendering
		$output = sprintf(
			'<div class="dicm-timesheet-tracker" data-config="%s">
				<div style="text-align: center; padding: 20px; color: #007cba;">
					<div class="loading-spinner">Loading Timesheet...</div>
				</div>
			</div>',
			esc_attr($config_json)
		);

		return $output;
	}

	/**
	 * Create timesheet entries table if it doesn't exist
	 */
	public function create_timesheet_table() {
		global $wpdb;
		
		$table_name = $wpdb->prefix . 'timesheet_entries';
		
		if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) != $table_name ) {
			$charset_collate = $wpdb->get_charset_collate();
			
			$sql = "CREATE TABLE $table_name (
				id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
				user_id bigint(20) UNSIGNED NOT NULL,
				entry_date date NOT NULL,
				project varchar(255) DEFAULT '',
				tasks text DEFAULT '',
				notes text DEFAULT '',
				hours decimal(8,2) DEFAULT 0.00,
				billable_rate decimal(10,2) DEFAULT 0.00,
				billable_amount decimal(12,2) DEFAULT 0.00,
				timer_seconds int DEFAULT 0,
				created_at datetime DEFAULT CURRENT_TIMESTAMP,
				updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				PRIMARY KEY (id),
				KEY user_date (user_id, entry_date),
				KEY user_id (user_id)
			) $charset_collate;";
			
			require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
			dbDelta( $sql );
		}
	}

	/**
	 * AJAX handler to save timesheet entry
	 */
	public function ajax_save_timesheet_entry() {
		// Debug logging
		error_log('TimesheetTracker: ajax_save_timesheet_entry called');
		error_log('TimesheetTracker: POST data: ' . print_r($_POST, true));
		
		// Verify user is logged in
		if ( ! is_user_logged_in() ) {
			error_log('TimesheetTracker: User not logged in');
			wp_send_json_error( array( 'message' => 'User not logged in' ) );
		}
		
		// Debug nonce
		if ( ! isset( $_POST['nonce'] ) ) {
			error_log('TimesheetTracker: No nonce in POST data');
			wp_send_json_error( array( 'message' => 'No nonce provided' ) );
		}
		
		$nonce_check = wp_verify_nonce( $_POST['nonce'], 'timesheet_tracker_nonce' );
		error_log('TimesheetTracker: Nonce check result: ' . ($nonce_check ? 'PASS' : 'FAIL'));
		
		if ( ! $nonce_check ) {
			error_log('TimesheetTracker: Nonce verification failed. Expected: timesheet_tracker_nonce, Got: ' . $_POST['nonce']);
			wp_send_json_error( array( 'message' => 'Nonce verification failed' ) );
		}

		global $wpdb;
		$table_name = $wpdb->prefix . 'timesheet_entries';
		$current_user_id = get_current_user_id();

		// Sanitize input data
		$entry_id = isset( $_POST['entry_id'] ) ? intval( $_POST['entry_id'] ) : 0;
		$entry_date = sanitize_text_field( $_POST['entry_date'] );
		$project = sanitize_text_field( $_POST['project'] );
		$tasks = sanitize_textarea_field( $_POST['tasks'] );
		$notes = sanitize_textarea_field( $_POST['notes'] );
		$hours = floatval( $_POST['hours'] );
		$billable_rate = floatval( $_POST['billable_rate'] );
		$billable_amount = $hours * $billable_rate;

		$data = array(
			'user_id' => $current_user_id,
			'entry_date' => $entry_date,
			'project' => $project,
			'tasks' => $tasks,
			'notes' => $notes,
			'hours' => $hours,
			'billable_rate' => $billable_rate,
			'billable_amount' => $billable_amount,
		);

		if ( $entry_id > 0 ) {
			// Update existing entry (only if owned by current user)
			$existing = $wpdb->get_row( $wpdb->prepare( 
				"SELECT user_id FROM $table_name WHERE id = %d", 
				$entry_id 
			) );
			
			if ( $existing && $existing->user_id == $current_user_id ) {
				$result = $wpdb->update( $table_name, $data, array( 'id' => $entry_id ) );
				wp_send_json_success( array( 
					'entry_id' => $entry_id,
					'message' => 'Entry updated successfully' 
				) );
			} else {
				wp_send_json_error( array( 'message' => 'Entry not found or access denied' ) );
			}
		} else {
			// Create new entry
			$result = $wpdb->insert( $table_name, $data );
			if ( $result !== false ) {
				wp_send_json_success( array( 
					'entry_id' => $wpdb->insert_id,
					'message' => 'Entry saved successfully' 
				) );
			} else {
				wp_send_json_error( array( 'message' => 'Failed to save entry' ) );
			}
		}
	}

	/**
	 * AJAX handler to load user's timesheet entries
	 */
	public function ajax_load_timesheet_entries() {
		// Verify nonce and user permissions
		if ( ! wp_verify_nonce( $_POST['nonce'], 'timesheet_tracker_nonce' ) || ! is_user_logged_in() ) {
			wp_send_json_error( array( 'message' => 'Access denied' ) );
		}

		global $wpdb;
		$table_name = $wpdb->prefix . 'timesheet_entries';
		$current_user_id = get_current_user_id();

		// Get date range (optional)
		$start_date = isset( $_POST['start_date'] ) ? sanitize_text_field( $_POST['start_date'] ) : '';
		$end_date = isset( $_POST['end_date'] ) ? sanitize_text_field( $_POST['end_date'] ) : '';

		$where_clause = "WHERE user_id = %d";
		$params = array( $current_user_id );

		if ( $start_date ) {
			$where_clause .= " AND entry_date >= %s";
			$params[] = $start_date;
		}
		if ( $end_date ) {
			$where_clause .= " AND entry_date <= %s";
			$params[] = $end_date;
		}

		$entries = $wpdb->get_results( $wpdb->prepare( 
			"SELECT * FROM $table_name $where_clause ORDER BY entry_date DESC, created_at DESC",
			$params
		) );

		wp_send_json_success( array( 'entries' => $entries ) );
	}

	/**
	 * AJAX handler to delete timesheet entry
	 */
	public function ajax_delete_timesheet_entry() {
		// Verify nonce and user permissions
		if ( ! wp_verify_nonce( $_POST['nonce'], 'timesheet_tracker_nonce' ) || ! is_user_logged_in() ) {
			wp_send_json_error( array( 'message' => 'Access denied' ) );
		}

		global $wpdb;
		$table_name = $wpdb->prefix . 'timesheet_entries';
		$current_user_id = get_current_user_id();
		$entry_id = intval( $_POST['entry_id'] );

		// Verify entry belongs to current user before deleting
		$existing = $wpdb->get_row( $wpdb->prepare( 
			"SELECT user_id FROM $table_name WHERE id = %d", 
			$entry_id 
		) );

		if ( $existing && $existing->user_id == $current_user_id ) {
			$result = $wpdb->delete( $table_name, array( 'id' => $entry_id ) );
			if ( $result !== false ) {
				wp_send_json_success( array( 'message' => 'Entry deleted successfully' ) );
			} else {
				wp_send_json_error( array( 'message' => 'Failed to delete entry' ) );
			}
		} else {
			wp_send_json_error( array( 'message' => 'Entry not found or access denied' ) );
		}
	}
}

new DICM_TimesheetTracker;