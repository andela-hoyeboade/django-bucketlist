import React, { Component } from 'react';

export default class Flash extends Component {
  constructor() {
    super();
    this.state = {
      flashMessage: '',
      timeout: 0
    }
    this.handleDisplayMessage = this.handleDisplayMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
  }

  shouldComponentUpdate() {
    this.handleDisplayMessage(this.props.content, this.props.timeout)
  }
  

  render() {
      return (
        <div>
        <h1>
            {this.state.flashMessage}
        </h1>
        </div>
      );
  }
}
