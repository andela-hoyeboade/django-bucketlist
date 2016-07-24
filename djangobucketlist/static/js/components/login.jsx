import React, { Component } from 'react';
import {
    Alert,
    Col,
    form,
    Form,
    FormGroup,
    FormControl,
    Control,
    ControlLabel,
    Checkbox,
    Button,
    Tab,
    Tabs
} from 'react-bootstrap';
import request from 'superagent';
import { Redirect } from 'react-router';
//import Flash from './flash.jsx';

export default class LoginForm extends Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleFieldChange = this.handleFieldChange.bind(this);
      this.handleDisplayMessage = this.handleDisplayMessage.bind(this);
      this.displayMessage = this.displayMessage.bind(this);
      this.hideMessage = this.hideMessage.bind(this);
      this.handleRedirectToDashboard = this.handleRedirectToDashboard.bind(this);
      this.state = {
        username: '',
        password: '',
        flashMessage: '',
        timeout: 0,
        displayFlashMessageStatus: "none"
      }
    }
    handleFieldChange(event) {
        event.preventDefault();
        let key = event.target.name;
        let value = event.target.value;
        this.setState({
            [key]: value
        });
    }

    handleSubmit(event) {
      event.preventDefault();
      this.loginUser(this.state.username, this.state.password);
    }

    handleDisplayMessage(message, timeout=3000) {
      this.displayMessage(message);
      setTimeout(this.hideMessage, timeout);
    }

    hideMessage() {
      this.setState({displayFlashMessageStatus: "none",
                    flashMessage: ""
                  });
    }

    displayMessage(message) {
      this.setState({flashMessage: message,
                    displayFlashMessageStatus: "block"
                  })
    }

    handleRedirectToDashboard() {
      localStorage.setItem('username', JSON.stringify(this.state.username));
      localStorage.setItem('token', JSON.stringify(this.state.token));
      localStorage.setItem('isAuthenticated', true);
      this.context.router.push('/dashboard');
    }

    loginUser(username, password) {
      request
        .post('/api/v1/auth/login')
        .type('form')
        .send({'username': username, 'password': password })
        .end((err, result) => {
            if (result.status === 200) {
              this.setState({
                    token: result.body.token
                });
              this.handleRedirectToDashboard()
            } else {
                var message = "Unable to log in. Please try again"
                if (!(result.body.message) === undefined);
                {
                  message = result.body.message
                }
                this.handleDisplayMessage(message)
            }

        })

    }

    render() {
      return(
        <div id="login">
        <div className="row">
        <div className="col-md-12">
        <div className="well  well-sm" style={this.props.menustyle}>
      <h1>Welcome Back</h1>
      <div style={{display:this.state.displayFlashMessageStatus}}>
      <Alert bsStyle="danger">
        {this.state.flashMessage}
      </Alert>
      </div>
      <Form action="post" onSubmit={this.handleSubmit} className="login">
        <FormGroup>
          <Col>Username:</Col>
          <FormControl
            name="username" type="text" required = {true} placeholder="Enter your username" onChange={this.handleFieldChange}
          />
        </FormGroup>
        <FormGroup>
          <Col>Password:</Col>
          <FormControl
            name="password" type="password" required = {true} placeholder="Enter your password" onChange={this.handleFieldChange}
          />
        </FormGroup>
        <FormGroup>
          <Button bsStyle="primary" type="submit">Log In</Button>
        </FormGroup>
      </Form>
      </div>
      </div>


        </div>
        </div>
      );
    }
}
LoginForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};
