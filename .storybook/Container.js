import React, { Component } from 'react';
import './_container.scss';

export default class Container extends Component {
  render() {
    const { story } = this.props;

    return (
      <div style={{
        fontFamily: 'sans-serif',
        fontSize: '1.1em',
        padding: '0 2em 2em 2em',
      }}>
        {story()}
      </div>
    );
  }
}
