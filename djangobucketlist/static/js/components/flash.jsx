import React, { Component } from 'react';

export default class Flash extends Component {

  render() {
      return (
        <div>
        <h1 id={this.props.id}>
            {this.props.content}
        </h1>
        </div>
      );
  }
}
