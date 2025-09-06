<?php
/*
Plugin Name: Divi Custom Modules
Plugin URI:  https://mdmventures.com/
Description: Plugin for MDM Divi custom modules
Version:     1.0.0
Author:      MDM - Jo Garcia
Author URI:  https://mdmventures.com/
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
