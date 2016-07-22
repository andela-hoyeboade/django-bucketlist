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

export default class RegisterForm extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleDisplayMessage = this.handleDisplayMessage.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      flashMessage: '',
      displayFlashMessageStatus: "none",
      timeout: 0
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
    this.registerUser(this.state.username, this.state.email, this.state.password, this.state.confirm_password);
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

  registerUser(username, email, password, confirm_password) {
    //alert("You are signing up with username:" + username + ",  email:" + email + " password:" + password + " confirm_password: "+confirm_password)
    request
      .post('/api/v1/auth/register')
      .send({'username': username, 'email': email, 'password': password, 'confirm_password': confirm_password })
      .type('form')
      .end((err, result) => {
          if (result.status === 200) {
            console.log("success")
            console.log(result.body.token);
            this.setState({
                  token: result.body.token
            });
            //window.location.reload();
            localStorage.setItem('username', JSON.stringify(this.state.username));
            localStorage.setItem('token', JSON.stringify(this.state.token));
            localStorage.setItem('isAuthenticated', true);
            this.context.router.push('/dashboard');
          } else {
              var message = "Unable to sign up. Please try again"
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
      <div id="signup">
      <div className="row">
      <div className="col-md-12">
      <div  className="well  well-sm" style={this.props.menustyle}>
    <h1>Sign Up for Free</h1>
    <div style={{display:this.state.displayFlashMessageStatus}}>
    <Alert bsStyle="danger">
      <p>{this.state.flashMessage}</p>
    </Alert>
    </div>
    <Form action="post" onSubmit={this.handleSubmit} className="signup">
    <FormGroup>
      <Col>Username:</Col>
      <FormControl
        type="text" name="username" required = {true} placeholder="Enter your username" onChange={this.handleFieldChange}
      />
      </FormGroup>
    <FormGroup>
      <Col>Email:</Col>
      <FormControl
        type="email" name="email" required = {true} placeholder="Enter your email" onChange={this.handleFieldChange}
        />
    </FormGroup>

    <FormGroup>
      <Col>Password:</Col>
      <FormControl
        type="password" name="password" required = {true} placeholder="Enter your password" onChange={this.handleFieldChange}
      />
    </FormGroup>
    <FormGroup>
      <Col>Confirm Password:</Col>
      <FormControl
        type="password" name="confirm_password" required = {true} placeholder="Confirm your password" onChange={this.handleFieldChange}
      />
    </FormGroup>
    <FormGroup>
      <Button bsStyle="primary" type="submit">Get Started</Button>
    </FormGroup>
    </Form>
    </div>
    </div>
      </div>
      </div>


    );
  }
}

RegisterForm.contextTypes = {
    router: React.PropTypes.object.isRequired
};
