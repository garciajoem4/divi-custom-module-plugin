// External Dependencies
import React, { Component } from 'react';

// Internal Dependencies
import './style.css';


class MainCarousel extends Component {

  static slug = 'ditc_main_carousel';

  render() {
    const Content = this.props.content;

    return (
      <h1>
        <Content/>
      </h1>
    );
  }
}

export default MainCarousel;
