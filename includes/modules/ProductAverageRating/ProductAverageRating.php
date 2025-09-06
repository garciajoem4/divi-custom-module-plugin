<?php

class DITC_ProductAverageRating extends ET_Builder_Module {

	public $slug       = 'ditc_product_average-rating';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'Product Average Rating', 'ditc-divi-product-average-rating' );
	}

	public function get_fields() {
		return array(
			'content' => array(
				'label'           => esc_html__( 'Content', 'ditc-divi-product-average-rating' ),
				'type'            => 'tiny_mce',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Content entered here will appear inside the module.', 'ditc-divi-product-average-rating' ),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		global $product;

		// Check if product is available
		if ( empty( $product ) ) return '';

		// Get the average rating
		$average_rating = $product->get_average_rating();

		// Get the rating count
		$rating_count = $product->get_rating_count();

		// If there are no ratings, return a message or empty string
		if ( $rating_count == 0 ) {
			return '';
		}

		// Display the rating with WooCommerce's built-in function
		return wc_get_rating_html( $average_rating );
	}
}

new DITC_ProductAverageRating;
