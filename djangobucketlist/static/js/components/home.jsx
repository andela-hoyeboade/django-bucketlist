import React, { Component } from 'react';
import LoginForm from './login.jsx';
import RegisterForm from './register.jsx';
import Menu from './menu.jsx';
import { Button } from 'react-bootstrap';

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
          registerFormShowStatus: "block",
          signUpTab: "active",
          loginFormShowStatus: "none",
          loginTab: ""
        }
        this.showSignUpForm = this.showSignUpForm.bind(this);
        this.showLoginForm = this.showLoginForm.bind(this);
    }

    componentWillMount() {
      if (localStorage.getItem('isAuthenticated') === 'true') {
        this.context.router.push('/dashboard');
      }
    }

    componentDidMount() {
      document.title = "Home Page - MyBucketlists";
    }

    showSignUpForm() {
      this.setState({
        registerFormShowStatus: "block",
        signUpTab: "active",
        loginFormShowStatus: "none",
        loginTab: ""
      });
    }

    showLoginForm() {
      this.setState({
        loginFormShowStatus: "block",
        loginTab: "active",
        registerFormShowStatus: "none",
        signUpTab: ""
      });
    }

        render() {
          return(
            <div>
            <Menu menustyle={{display:"none"}}
          />
            <div className="form">
            <ul className="tab-group">

              <li className={"tab " + this.state.signUpTab}><a onClick={this.showSignUpForm}>Sign Up</a></li>
              <li className={"tab " + this.state.loginTab}><a onClick={this.showLoginForm}>Log In</a></li>
            </ul>

            <LoginForm  menustyle={{display:this.state.loginFormShowStatus}} />
            <RegisterForm menustyle={{display:this.state.registerFormShowStatus}} />
            </div>
            </div>
          );
        }
}

Home.contextTypes = {
    router: React.PropTypes.object.isRequired
};
