import React, { Component } from 'react';
import { Col, form, Form, FormGroup,
    FormControl,
    Control,
    ControlLabel,
    Checkbox,
    Button,
    Tab,
    Tabs,
    SplitButton,
    MenuItem,
    DropdownButton,
    ButtonGroup,
    Navbar,
    Nav,
    NavItem,
    NavDropdown,
} from 'react-bootstrap';



export default class Menu extends Component {
   constructor() {
        super();
    }

    render() {
        return (
          <div className="menu">
            <Navbar staticTop={true}>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#">MyBucketlists</a>
                </Navbar.Brand>
            </Navbar.Header>
            <div style={this.props.menustyle}>
            <Nav pullRight>
              <NavDropdown eventKey={3} title={this.props.username || ""} id="basic-nav-dropdown">
                <MenuItem onClick={this.props.handleLogout} eventKey={3.1}>Logout</MenuItem>
              </NavDropdown>
            </Nav>
            </div>
            </Navbar>
            </div>

        );
    }
}
