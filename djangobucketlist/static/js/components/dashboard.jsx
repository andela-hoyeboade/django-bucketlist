import React, { Component } from 'react';
import Menu from './menu.jsx';
import BucketList from './bucketlist.jsx';
import BucketListItem from './bucketlistitem.jsx';
import request from 'superagent';
import BucketListModalForm from './bucketlist-item-modal.jsx';

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
    Tabs,
    ButtonToolbar
} from 'react-bootstrap';
export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
          bucketlists: [],
          bucketlistId: 0,
          bucketlistName: '',
          bucketlistItemName: '',
          bucketlistItemStatus: false,
          newBucketlistForm: false,
          newBucketlistItemForm: false,
          editBucketlistForm: false,
          items: [],
          displayFlashMessageStatus: "none",
          flashMessage: "",
          messageType: "success"
        }
        this.fetchAllBucketlists = this.fetchAllBucketlists.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }

    componentWillMount() {
      if (!(localStorage.getItem('isAuthenticated') === 'true')) {
        this.context.router.push('/');
      }
    }

    componentDidMount() {
      document.title = "Dashboard - MyBucketlists";
        this.fetchAllBucketlists();
    }

    fetchAllBucketlists() {
      request
        .get('/api/v1/bucketlists/')
        .set('Authorization', 'Token ' + (JSON.parse(localStorage
              .getItem('token'))))
        .end((err, result) => {
          if (result.status === 200) {
            this.setState({
              bucketlists: result.body,
            });
          } else {
            this.setState({
              bucketlists: [],
            });
          }
        });
    }

    handleLogout() {
      localStorage.clear();
      this.context.router.push('/');
    }

    handleFieldChange(event) {
        event.preventDefault();
        let key = event.target.name;
        let value = event.target.value;
        this.setState({
            [key]: value
        });
    }


    render() {

      return (
        <div>
          <Menu
            username={(JSON.parse(localStorage.getItem('username')))}
            handleLogout={this.handleLogout} menustyle={{display:"block"}}
          />

          <BucketList
            bucketlists={this.state.bucketlists}
            fetchAllBucketlists={this.fetchAllBucketlists}
            flashMessage={this.state.flashMessage}
            messageType={this.state.messageType}
            displayFlashMessageStatus={this.state.displayFlashMessageStatus}
          />
      </div>
      );
    }

  }

Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
};
