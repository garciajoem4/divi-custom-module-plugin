// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';


class TestimonialBlocks extends Component {

  static slug = 'ditc_testimonial_blocks';

  render() {
    const Content = this.props.content;

    return (
      <h1>
        <Content/>
      </h1>
    );
  }
}

export default TestimonialBlocks;
