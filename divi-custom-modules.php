<?php
/*
Plugin Name: Divi Custom Modules
Plugin URI:  https://garciajoemari.com/
Description: Plugin for Divi custom modules
Version:     1.0.0
Author:      Jo Garcia
Author URI:  https://garciajoemari.com/
License:     GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: dicm-divi-custom-modules
Domain Path: /languages

Divi Custom Modules is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

Divi Custom Modules is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Divi Custom Modules. If not, see https://www.gnu.org/licenses/gpl-2.0.html.
*/


if ( ! function_exists( 'dicm_initialize_extension' ) ):
/**
 * Creates the extension's main class instance.
 *
 * @since 1.0.0
 */
function dicm_initialize_extension() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/DiviCustomModules.php';
}
add_action( 'divi_extensions_init', 'dicm_initialize_extension' );
endif;

// Simple AJAX handlers for TimesheetTracker (procedural approach)
function dicm_timesheet_save_entry() {
	error_log('TimesheetTracker: dicm_timesheet_save_entry called');
	
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
		error_log('TimesheetTracker: Nonce verification failed');
		wp_send_json_error( array( 'message' => 'Nonce verification failed' ) );
	}
	
	global $wpdb;
	$table_name = $wpdb->prefix . 'timesheet_entries';
	$current_user_id = get_current_user_id();

	// Create table if it doesn't exist
	dicm_create_timesheet_table();

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
		// Update existing entry
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
			wp_send_json_error( array( 'message' => 'Failed to save entry. Database error: ' . $wpdb->last_error ) );
		}
	}
}

function dicm_timesheet_load_entries() {
	error_log('TimesheetTracker: dicm_timesheet_load_entries called');
	
	if ( ! is_user_logged_in() || ! wp_verify_nonce( $_POST['nonce'], 'timesheet_tracker_nonce' ) ) {
		wp_send_json_error( array( 'message' => 'Access denied' ) );
	}

	global $wpdb;
	$table_name = $wpdb->prefix . 'timesheet_entries';
	$current_user_id = get_current_user_id();

	// Get optional date range parameters for filtering
	$start_date = sanitize_text_field( $_POST['start_date'] ?? '' );
	$end_date = sanitize_text_field( $_POST['end_date'] ?? '' );

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

function dicm_timesheet_delete_entry() {
	error_log('TimesheetTracker: dicm_timesheet_delete_entry called');
	
	if ( ! is_user_logged_in() || ! wp_verify_nonce( $_POST['nonce'], 'timesheet_tracker_nonce' ) ) {
		wp_send_json_error( array( 'message' => 'Access denied' ) );
	}

	global $wpdb;
	$table_name = $wpdb->prefix . 'timesheet_entries';
	$current_user_id = get_current_user_id();
	$entry_id = intval( $_POST['entry_id'] );

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

function dicm_create_timesheet_table() {
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'timesheet_entries';
	
	if ( $wpdb->get_var( "SHOW TABLES LIKE '$table_name'" ) != $table_name ) {
		$charset_collate = $wpdb->get_charset_collate();
		
		$sql = "CREATE TABLE $table_name (
			id int(11) NOT NULL AUTO_INCREMENT,
			user_id bigint(20) unsigned NOT NULL,
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
		error_log('TimesheetTracker: Database table created');
	}
}

function dicm_timesheet_load_public_entries() {
	error_log('TimesheetTracker: dicm_timesheet_load_public_entries called');
	
	global $wpdb;
	$table_name = $wpdb->prefix . 'timesheet_entries';
	
	// Get filter parameter and custom date ranges
	$filter = sanitize_text_field( $_POST['filter'] ?? 'this_week' );
	$custom_start_date = sanitize_text_field( $_POST['start_date'] ?? '' );
	$custom_end_date = sanitize_text_field( $_POST['end_date'] ?? '' );
	
	// Calculate date ranges based on filter
	$start_date = '';
	$end_date = '';
	
	// Handle custom date range
	if ( $filter === 'custom' && $custom_start_date && $custom_end_date ) {
		$start_date = $custom_start_date;
		$end_date = $custom_end_date;
	} else {
		// Handle predefined filters
		switch( $filter ) {
		case 'this_week':
			$start_date = date('Y-m-d', strtotime('monday this week'));
			$end_date = date('Y-m-d', strtotime('sunday this week'));
			break;
		case 'last_week':
			$start_date = date('Y-m-d', strtotime('monday last week'));
			$end_date = date('Y-m-d', strtotime('sunday last week'));
			break;
		case 'this_month':
			$start_date = date('Y-m-01');
			$end_date = date('Y-m-t');
			break;
		case 'last_month':
			$start_date = date('Y-m-01', strtotime('first day of last month'));
			$end_date = date('Y-m-t', strtotime('last day of last month'));
			break;
		default:
			// Default to this week
			$start_date = date('Y-m-d', strtotime('monday this week'));
			$end_date = date('Y-m-d', strtotime('sunday this week'));
		}
	}
	
	error_log("TimesheetTracker: Loading public entries from $start_date to $end_date");
	
	// Query entries within date range - exclude user info and financial data for privacy
	$entries = $wpdb->get_results( $wpdb->prepare( 
		"SELECT 
			entry_date, 
			project, 
			tasks, 
			notes, 
			hours 
		FROM $table_name 
		WHERE entry_date BETWEEN %s AND %s 
		ORDER BY entry_date DESC, id DESC",
		$start_date, 
		$end_date 
	) );
	
	// Get user details of contributors who have timesheet entries (for public transparency)
	$contributors = $wpdb->get_results( 
		"SELECT DISTINCT 
			u.display_name as name,
			u.user_email as email,
			MAX(t.updated_at) as last_activity,
			SUM(t.hours) as total_hours,
			COUNT(t.id) as total_entries
		FROM {$wpdb->users} u 
		JOIN $table_name t ON u.ID = t.user_id 
		GROUP BY u.ID, u.display_name, u.user_email 
		ORDER BY last_activity DESC"
	);
	
	if ( $entries ) {
		error_log('TimesheetTracker: Found ' . count($entries) . ' public entries and ' . count($contributors) . ' contributors');
		wp_send_json_success( array( 
			'entries' => $entries,
			'contributors' => $contributors,
			'filter' => $filter,
			'date_range' => array(
				'start' => $start_date,
				'end' => $end_date
			)
		) );
	} else {
		error_log('TimesheetTracker: No public entries found');
		wp_send_json_success( array( 
			'entries' => array(),
			'contributors' => $contributors || array(),
			'filter' => $filter,
			'date_range' => array(
				'start' => $start_date,
				'end' => $end_date
			)
		) );
	}
}

// Register AJAX handlers
add_action( 'wp_ajax_timesheet_save_entry', 'dicm_timesheet_save_entry' );
add_action( 'wp_ajax_timesheet_load_entries', 'dicm_timesheet_load_entries' );
add_action( 'wp_ajax_timesheet_delete_entry', 'dicm_timesheet_delete_entry' );

// Public data endpoint - available to both logged and non-logged users
add_action( 'wp_ajax_timesheet_load_public_entries', 'dicm_timesheet_load_public_entries' );
add_action( 'wp_ajax_nopriv_timesheet_load_public_entries', 'dicm_timesheet_load_public_entries' );

// Create table on plugin load
add_action( 'init', 'dicm_create_timesheet_table' );

// Track user login times for user details display
function dicm_track_user_login( $user_login, $user ) {
	update_user_meta( $user->ID, 'last_login', current_time( 'mysql' ) );
}
add_action( 'wp_login', 'dicm_track_user_login', 10, 2 );

error_log('TimesheetTracker: Procedural AJAX handlers registered');
