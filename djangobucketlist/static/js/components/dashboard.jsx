import React, { Component } from 'react';
import Menu from './menu.jsx';
import BucketList from './bucketlist.jsx';
import request from 'superagent';
import { Pagination } from 'react-bootstrap';

export default class Dashboard extends Component {
  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.fetchAllBucketlists = this.fetchAllBucketlists.bind(this);
    this.fetchBucketlistByPage = this.fetchBucketlistByPage.bind(this);
    this.state = {
      bucketlists: [],
      bucketlistCount: 0
    }
  }

  componentWillMount() {
    if (!localStorage.getItem('isAuthenticated')) {
      this.context.router.push('/')
    }
  }

  fetchBucketlistByPage(page) {
    request
      .get('/api/v1/bucketlists/?page='+page)
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .end((err, result) => {
        if (result.status === 200) {
          this.setState({
            bucketlists: result.body.results,
          });
        }
      });
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
          var count = result.body.count
          var countValue =  (count % 10 === 0) ? count/10 : Math.floor(count/10) + 1
          this.setState({
            bucketlists: result.body.results,
            bucketlistCount: countValue
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
          fetchBucketlistByPage={this.fetchBucketlistByPage}
          bucketlistCount={this.state.bucketlistCount}
        />
        </div>
    );
  }
}

Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
};
