<?php

class DITC_MainCarousel extends ET_Builder_Module {

	public $slug       = 'ditc_main_carousel';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'Main Carousel', 'ditc-divi-main-carousel' );
	}

	public function get_fields() {
		return array(
			'content' => array(
				'label'           => esc_html__( 'Content', 'ditc-divi-main-carousel' ),
				'type'            => 'tiny_mce',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Content entered here will appear inside the module.', 'ditc-divi-main-carousel' ),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		$banner_slides = get_fields(get_the_ID())['banner_slides'];

		$block = '<div class="hero-banner slideshow"><div class="slider slider_hero">';
		foreach ($banner_slides as $key => $slide) {
			$block .= '<div class="slide">';
			$block .= '<div class="slide-container">';
			$block .= '<div class="slider-background" style="background-image: url('.$slide['feature_image']['url'].')"></div>';
			$block .= '<img class="slider-img" src="'.$slide['feature_image']['url'].'" alt="'.$slide['feature_image']['alt'].'"/>';
			$block .= '<div class="slide-content">';
			$block .= '<div class="content-heading">';
			$block .= '<h2>';
			$block .= $slide['heading_line_1'] !== '' ? '<span>'.$slide['heading_line_1'].'</span>' : '';
			$block .= $slide['heading_line_2'] !== '' ? '<span>'.$slide['heading_line_2'].'</span>' : '';
			$block .= $slide['heading_line_3'] !== '' ? '<span>'.$slide['heading_line_3'].'</span>' : '';
			$block .= '</h2>';
			$block .= '</div>';
			$block .= '<div class="content-sub_heading">';
			$block .= '<p>';
			foreach ($slide['sub_headings'] as $subheading) {
				$block .= $subheading['text_description'] !== '' ? '<span>'.$subheading['text_description'].'</span> ' : '';
			}
			$block .= '</p>';
			$block .= '</div>';
			$block .= '<div class="content-sub_image">';
			$block .= '<img class="sub-image" src="'.$slide['sub_image']['url'].'" alt="'.$slide['sub_image']['alt'].'"/>';
			$block .= '</div>';
			$block .= '</div>';
			$block .= '</div>';
			$block .= '</div>';
		}
		$block .= '</div></div>';
		//return print_r($banner_slides);
		//return print("<pre>".print_r($banner_slides,true)."</pre>");
		return sprintf($block);
	}
}

new DITC_MainCarousel;
