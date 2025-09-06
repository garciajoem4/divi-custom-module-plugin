<?php

class DITC_ProductComposition extends ET_Builder_Module {

	public $slug       = 'ditc_product_composition';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'Product Composition', 'ditc-divi-product-composition' );
	}

	public function get_fields() {
		return array(
			'content' => array(
				'label'           => esc_html__( 'Content', 'ditc-divi-product-composition' ),
				'type'            => 'tiny_mce',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Content entered here will appear inside the module.', 'ditc-divi-product-composition' ),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		$compositions = get_fields(get_the_ID());
		$block = '';

		if (isset($compositions['compositions'])) {
			$compositionItems = $compositions['compositions'];

			if (count($compositionItems) > 0) {
				if (!empty($compositionItems[0]['image']) && !empty($compositionItems[0]['name']) && !empty($compositionItems[0]['description'])) {
					$block .= '<div class="divi-block divi-block_product-composition is-slider">';
					$block .= '<div class="divi-block_product-composition-slider">';

					foreach ($compositionItems as $key => $val) {
						$block .= '<div class="block-item-pc_slide">';
						$block .= '<div class="block-item-pc block-item-pc_'.$key.'">';
						$block .= '<div class="block-item-pc_image-container">';
						$block .= '<img class="block-item-pc_image" src="'.$val['image'].'"/>';
						$block .= '</div>';
						$block .= '<div class="block-item-pc_content">';
						$block .= '<h3 class="block-item-pc_title">'.$val['name'].'</h3>';
						$block .= '<p class="block-item-pc_description">'.$val['description'].'</p>';
						$block .= '</div>';
						$block .= '</div>';
						$block .= '</div>';
					}

					$block .= '</div>';
					$block .= '</div>';
				}
			}
		}
		
		return sprintf($block);
	}
}

new DITC_ProductComposition;
