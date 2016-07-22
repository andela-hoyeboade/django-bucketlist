import React, { Component } from 'react';
import {
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
import Flash from './flash.jsx';

export default class LoginForm extends Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleFieldChange = this.handleFieldChange.bind(this);
      this.state = {
        username: '',
        password: ''
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

    loginUser(username, password) {
      //alert("You are logged in with username:" + username + " and " + "password:" +password)
      request
        .post('/api/v1/auth/login')
        .send({'username': username, 'password': password })
        .end((err, result) => {
            if (result.status === 200) {
              this.setState({
                    token: result.body.token
                });
              console.log("success")
              console.log(result.body.token);
              //window.location.reload();
              localStorage.setItem('username', JSON.stringify(this.state.username));
              localStorage.setItem('token', JSON.stringify(this.state.token));
              localStorage.setItem('isAuthenticated', true);
              this.context.router.push('/dashboard');
              //<Redirect to="/dashboard"/>

// this should appear outside the element
/*
                this.setState({
                    token: result.body.token
                });
                localStorage.setItem('token', JSON.stringify(this.state.token));
                localStorage.setItem('username',
                    JSON.stringify(this.state.username));
                window.location.reload()
                this.props.history.pushState({token: this.state.token}, '/home');
*/
            } else {
                console.log(result.status);
                console.log(result.body.message);
                <Flash id="message" content={result.body.message} />
                //this.setState({
                //    error: true;
                //})
            }

        })

    }


    render() {
      return(
        <div id="login">
        <div className="row">
        <div className="col-md-12">
        <div className="well  well-sm">
      <h1>Welcome Back</h1>
      <Form action="post" onSubmit={this.handleSubmit} className="login">
      <FormGroup><Col>Username:</Col>
      <FormControl
        name="username" type="text" required = {true} placeholder="Enter your username" onChange={this.handleFieldChange}
      />
      </FormGroup>
        <FormGroup><Col>Password:</Col>
      <FormControl
        name="password" type="password" required = {true} placeholder="Enter your password" onChange={this.handleFieldChange}
      />
      </FormGroup>
      <FormGroup>
      <Button type="submit" className="btn btn-primary">Log In</Button>
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
