<?php

class DITC_TestimonialBlocks extends ET_Builder_Module {

	public $slug       = 'ditc_testimonial_blocks';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'Testimonial Blocks', 'ditc-divi-testimonial-blocks' );
	}

	public function get_fields() {
		return array(
			'content' => array(
				'label'           => esc_html__( 'Content', 'ditc-divi-testimonial-blocks' ),
				'type'            => 'tiny_mce',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Content entered here will appear inside the module.', 'ditc-divi-testimonial-blocks' ),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		$testimonials = get_posts([
			'post_type' => 'testimonial_blocks',
			'post_status' => 'publish',
			'numberposts' => -1,
			'order'    => 'ASC'
		]);

		// return print_r( get_fields($testimonials[0]->ID) );

		$block = '<div class="divi-block divi-block_testimonial">';
		foreach ($testimonials as $key => $testimonial) {
			$fields = get_fields($testimonial->ID);
			$name = get_the_title($testimonial->ID);

			$block .= '<div class="block-testimonial block-testimonial_'.$key.'">';

			$caption = '<div class="block-item block-item_caption"><p class="block-item_description">"'.$fields['caption'].'"</p><p class="block-item_name">'.$name.'</p></div>';

			if ($key < 3) {
				$block .= $caption;
			}

			$block .= '<div class="block-item block-item_images" '.(count($fields['images']) == 1 ? 'style="background-image: url('.$fields['images'][0]['image']['url'].')"': '').'>';
			if (count($fields['images']) > 1) {
				$block .= '<div class="block-item_images-slider block-item_images-slider-'.$key.'">';
				foreach ($fields['images'] as $ik => $iv) {
					$block .= '<div class="block-item_image-slide block-item_images" style="background-image: url('.$iv['image']['url'].')">';
					$block .= '<img class="block-item_image" src="'.$iv['image']['url'].'"/>';
					$block .= '</div>';
				}
				$block .= '</div>';
			} else {
				$block .= '<img class="block-item_image" src="'.$fields['images'][0]['image']['url'].'"/>';
			}
			$block .= '</div>';

			if ($key > 2) {
				$block .= $caption;
			}
			
			$block .= '</div>';
		}
		$block .= '</div>';
		
		return sprintf($block);
	}
}

new DITC_TestimonialBlocks;
