import React, { Component } from 'react';
import LoginForm from './login.jsx';
import RegisterForm from './register.jsx';
import Menu from './menu.jsx';
export default class Home extends Component {
    constructor() {
        super();
    }
        render() {
          return(
            <div>
            <Menu menustyle={{display:"none"}}
          />
            <div className="form">

            <ul className="tab-group">
              <li className="tab active"><a href="#">Sign Up</a></li>
              <li className="tab"><a href="#">Log In</a></li>
            </ul>

            <LoginForm />
            <RegisterForm />
            </div>
            </div>
          );
        }
}
