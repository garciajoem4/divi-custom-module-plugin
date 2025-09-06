// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';


class ProductComposition extends Component {

  static slug = 'ditc_product_composition';

  render() {
    const Content = this.props.content;

    return (
      <h1>
        <Content/>
      </h1>
    );
  }
}

export default ProductComposition;
