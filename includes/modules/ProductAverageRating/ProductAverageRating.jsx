// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';


class ProductAverageRating extends Component {

  static slug = 'ditc_product_average-rating';

  render() {
    const Content = this.props.content;

    return (
      <h1>
        <Content/>
      </h1>
    );
  }
}

export default ProductAverageRating;
