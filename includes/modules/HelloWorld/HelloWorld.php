<?php

class DICM_HelloWorld extends ET_Builder_Module {

	public $slug       = 'dicm_hello_world';
	public $vb_support = 'on';

	protected $module_credits = array(
		'module_uri' => 'https://mdmventures.com/',
		'author'     => 'MDM - Jo Garcia',
		'author_uri' => 'https://mdmventures.com/',
	);

	public function init() {
		$this->name = esc_html__( 'Hello World', 'dicm-divi-custom-modules' );
	}

	public function get_fields() {
		return array(
			'content' => array(
				'label'           => esc_html__( 'Content', 'dicm-divi-custom-modules' ),
				'type'            => 'tiny_mce',
				'option_category' => 'basic_option',
				'description'     => esc_html__( 'Content entered here will appear inside the module.', 'dicm-divi-custom-modules' ),
				'toggle_slug'     => 'main_content',
			),
		);
	}

	public function render( $attrs, $content = null, $render_slug ) {
		// print_r(get_the_ID());
		return sprintf( 
			'<div>'.get_the_ID().'</div>'
		);
	}
}

new DICM_HelloWorld;
