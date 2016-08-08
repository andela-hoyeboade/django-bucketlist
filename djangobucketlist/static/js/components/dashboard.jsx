import React, { Component } from 'react';
import Menu from './menu.jsx';
import BucketList from './bucketlist.jsx';
import request from 'superagent';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.fetchAllBucketlists = this.fetchAllBucketlists.bind(this);
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
    }
  }

  componentWillMount() {
    if (!localStorage.getItem('isAuthenticated')) {
      this.context.router.push('/')
    }
  }

  componentDidMount() {
    document.title = "Dashboard - MyBucketlists";
    this.fetchAllBucketlists();
  }

  fetchAllBucketlists() {
    console.log(JSON.parse(localStorage
          .getItem('token')))
    request
      .get('/api/v1/bucketlists/')
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .end((err, result) => {
        if (result.status === 200) {
          this.setState({
            bucketlists: result.body.results,
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
        />

      </div>
    );
  }
}

Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
};
