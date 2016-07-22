import React, { Component } from 'react';
import Menu from './menu.jsx';
import BucketList from './bucketlist.jsx';
import BucketListItem from './bucketlistitem.jsx';
import request from 'superagent';
import BucketListModalForm from './bucketlist-edit-modal.jsx';

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
          search: '',
          bucketlists: [],
          bucketlistId: 0,
          bucketlistName: '',
          bucketlistItemName: '',
          bucketlistItemStatus: false,
          newBucketlistForm: false,
          newBucketlistItemForm: false,
          editBucketlistForm: false,
          items: []
        }
        this.fetchAllBucketlists = this.fetchAllBucketlists.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSaveNewBucketlist = this.handleSaveNewBucketlist.bind(this);
        this.saveNewBucketlist = this.saveNewBucketlist.bind(this);
        this.showNewBucketlistForm = this.showNewBucketlistForm.bind(this);
        this.hideNewBucketlistForm = this.hideNewBucketlistForm.bind(this);

        }




    componentWillMount() {
      if (!(localStorage.getItem('isAuthenticated') === 'true')) {
        this.context.router.push('/');
      }
    }

    componentDidMount() {
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

    showNewBucketlistForm(event) {
      event.preventDefault();
      return this.setState({ newBucketlistForm: true });
    }

    hideNewBucketlistForm() {
      this.setState({ newBucketlistForm: false });
    }

    handleSaveNewBucketlist(event) {
      event.preventDefault();
      this.saveNewBucketlist(this.state.bucketlistName);
      this.hideNewBucketlistForm();
    }

    saveNewBucketlist(bucketlistName) {
      if (bucketlistName === '') {
        return;
      }
      request
        .post('/api/v1/bucketlists/')
        .set('Authorization', 'Token ' + (JSON.parse(localStorage
              .getItem('token'))))
        .send({"name": bucketlistName, "items": [] })
        .end((err, result) => {
          if (result.status === 201) {
            this.fetchAllBucketlists();
          } else {

            //console.log(result.status);
            console.log(bucketlistName);
            console.log(result.body.message);
            console.log(result.body.errors);
          }
        });
    }

    handleSearch(event) {
      event.preventDefault();
      search_term = this.state.search;
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
      //console.log(this, '%%%');
      let closeNewBucketlistForm = () => this.setState({ newBucketlistForm: false });

      return (
        <div>
          <Menu
            username={(JSON.parse(localStorage.getItem('username')))}
            handleLogout={this.handleLogout} menustyle={{display:"inline-block"}}
          />

          <div className="container">
            <div className="row">
              <div id="new-bucket-list" className="col-sm-4">
                <button type="button" className="btn btn-success new-bucket-list" onClick={this.showNewBucketlistForm} title="Create New Bucketlist">
                  Create New Bucketlist
                </button>
              </div>
              <div id="search-bucket-list" className="col-sm-4 search-bucket-list">
                <Form action="post" onSubmit={this.handleSearch}>
                  <FormGroup>
                    <FormControl
                      name="username" type="text" required = {true} placeholder="Search My Bucketlists" onChange={this.handleFieldChange}
                    />
                    <button type="submit" className="btn btn-default search" title="Search Bucketlists">
                      Search
                    </button>
                  </FormGroup>
                </Form>
              </div>
            </div>

          </div>
          <BucketList
            bucketlists={this.state.bucketlists}
            fetchAllBucketlists={this.fetchAllBucketlists}
          />

          <BucketListModalForm
            show={this.state.newBucketlistForm}
            onHide={closeNewBucketlistForm}
            handleFieldChange={this.handleFieldChange}
            onSave={this.handleSaveNewBucketlist}
            formtitle="Add Bucketlist"
            placeholder="Enter bucketlist name"
          />

      </div>
      );
    }

  }

Dashboard.contextTypes = {
    router: React.PropTypes.object.isRequired
};
