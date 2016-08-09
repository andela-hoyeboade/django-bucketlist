import React, { Component } from 'react';
import BucketListItem from './bucketlistitem.jsx';
import BucketListModalForm from './bucketlist-modal.jsx';
import BucketListItemModalForm from './bucketlist-item-modal.jsx';
import request from 'superagent';
import { OverlayTrigger, Popover, Accordion, Panel, Alert, Pagination } from 'react-bootstrap';

export default class BucketList extends Component {
  constructor() {
    super();
    this.onbucketlistClick = this.onbucketlistClick.bind(this);
    this.deleteBucketlist = this.deleteBucketlist.bind(this);
    this.displayAllBucketlists = this.displayAllBucketlists.bind(this);
    this.displaySingleBucketlist = this.displaySingleBucketlist.bind(this);
    this.fetchBucketlistItems = this.fetchBucketlistItems.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSaveNewBucketlistItem = this.handleSaveNewBucketlistItem.bind(this);
    this.saveNewBucketlistItem = this.saveNewBucketlistItem.bind(this);
    this.submitNewBucketlistItem = this.submitNewBucketlistItem.bind(this);
    this.showNewBucketlistItemForm = this.showNewBucketlistItemForm.bind(this);
    this.showEditBucketlistForm = this.showEditBucketlistForm.bind(this);
    this.handleEditBucketlist = this.handleEditBucketlist.bind(this);
    this.handleUpdateBucketlist = this.handleUpdateBucketlist.bind(this);
    this.updateBucketlist = this.updateBucketlist.bind(this);
    this.handleSaveNewBucketlist = this.handleSaveNewBucketlist.bind(this);
    this.saveNewBucketlist = this.saveNewBucketlist.bind(this);
    this.showNewBucketlistForm = this.showNewBucketlistForm.bind(this);
    this.hideNewBucketlistForm = this.hideNewBucketlistForm.bind(this);
    this.displayFlashMessage = this.displayFlashMessage.bind(this);
    this.hideDeletePopover = this.hideDeletePopover.bind(this);
    this.displayNewItemFlashMessage = this.displayNewItemFlashMessage.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      items: [],
      newBucketListName: '',
      bucketlistName: '',
      bucketlistId: 0,
      itemName: '',
      showDeletePopover: false,
      itemDoneStatus: false,
      flashMessage: "",
      messageType: "success",
      displayFlashMessageStatus: "none",
      displayNewItemMessageStatus: "none",
      newItemFlashMessage: "",
      newItemMessageType: "success",
      activePage: 1,
    }
  }

  handleClick(no) {
    alert(no)
//    this.props.fetchBucketlistByPage(this.state.activePage)
  }

  handleSelect(eventKey) {
    this.setState({
      activePage: eventKey
    });
    this.props.fetchBucketlistByPage(eventKey)
  }

  onbucketlistClick(bucketlistId, bucketlistName) {
    if (bucketlistId === '' || bucketlistId === undefined) {
      return;
    }
    else {
      this.setState({
        bucketlistId: bucketlistId,
        bucketlistName: bucketlistName
      });
      this.fetchBucketlistItems(bucketlistId);
    }
  }

  showNewBucketlistForm(event) {
    event.preventDefault();
    this.setState({ newBucketlistForm: true });
  }

  hideNewBucketlistForm() {
    this.setState({ newBucketlistForm: false });
  }

  handleSaveNewBucketlist(event) {
    event.preventDefault();
    this.saveNewBucketlist(this.state.newBucketListName);
    this.hideNewBucketlistForm();
  }

  saveNewBucketlist(bucketlistName) {
    if (bucketlistName === '') {
      return;
    }
    request
      .post('/api/v1/bucketlists/')
      .type('form')
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .send({"name": bucketlistName})
      .end((err, result) => {
        if (result) {
          if (result.status === 201) {
            this.props.fetchAllBucketlists();
            return this.displayFlashMessage("Succesfully created", "success")
          }
          var message = (("detail" in result.body) && !(result.body.detail === '')) ? result.body.detail : "Unable to create a new bucketlist"
          return this.displayFlashMessage(message, "danger")
        }
        return this.displayFlashMessage("An error occured", "danger")
      });
  }
  displayFlashMessage(message, messageType) {
    this.setState({flashMessage: message,
                  displayFlashMessageStatus: "block",
                  messageType: messageType
                });
    setTimeout(function() {
      this.setState({displayFlashMessageStatus: "none",
        flashMessage: ""
      });
    }.bind(this), 3000);
  }

  displayNewItemFlashMessage(message, messageType) {
    this.setState({newItemFlashMessage: message,
                    displayNewItemMessageStatus: "block",
                  newItemMessageType: messageType});
    setTimeout(function() {
      this.setState({displayNewItemMessageStatus: "none",
                    newItemFlashMessage: ""
                  });
    }.bind(this), 3000)}


  deleteBucketlist(bucketlistId) {
    if (bucketlistId === '' || bucketlistId === 0 || bucketlistId === undefined) {
      return;
    }
    request
      .delete('/api/v1/bucketlists/'+bucketlistId)
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .end((err, result) => {
        if (result) {
          if (result.status === 204) {
            this.props.fetchAllBucketlists();
            return this.displayFlashMessage("Succesfully deleted", "success")
          }
          var message = (("detail" in result.body) && !(result.body.detail === '')) ? result.body.detail : "Unable to delete bucketlist"
          return this.displayFlashMessage(message, "danger")
        }
        return this.displayFlashMessage("An error occured", "danger")
      });
  }

  handleSaveNewBucketlistItem(bucketlistId, bucketlistName) {
    this.setState({
      bucketlistId: bucketlistId,
      bucketlistName: bucketlistName,
    });
    this.showNewBucketlistItemForm();
  }

  handleFieldChange(event) {
      event.preventDefault();
      let key = event.target.name;
      let value = event.target.value;
      this.setState({
          [key]: value
      });
  }

  showNewBucketlistItemForm() {
    this.setState({ newBucketlistItemForm: true });
  }

  submitNewBucketlistItem(event) {
    event.preventDefault();
    this.saveNewBucketlistItem(this.state.bucketlistId, this.state.itemName);
    this.hideNewBucketlistItemForm();
  }

  saveNewBucketlistItem(bucketlistId, itemName) {
    if (itemName === '' || bucketlistId === '' || bucketlistId === undefined) {
      return;
    }
    request
      .post('/api/v1/bucketlists/'+bucketlistId+'/items/')
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .send({"name": itemName })
      .end((err, result) => {
        if (result) {
          if (result.status === 201) {
            this.props.fetchAllBucketlists();
            this.fetchBucketlistItems(bucketlistId)
            return this.displayNewItemFlashMessage("Succesfully created", "success")
          }
          var message = (("detail" in result.body) && !(result.body.detail === '')) ? result.body.detail : "Unable to create item"
          return this.displayNewItemFlashMessage(message, "danger")
        }
        return this.displayNewItemFlashMessage("An error occured", "danger")
      });
  }

  hideNewBucketlistItemForm() {
    this.setState({ newBucketlistItemForm: false });
  }

  handleEditBucketlist(bucketlistId, bucketlistName) {
    this.setState({
      bucketlistId: bucketlistId,
      bucketlistName: bucketlistName
    });
    this.showEditBucketlistForm();
  }

  showEditBucketlistForm() {
    this.setState({ editBucketlistForm: true });
  }
  hideEditBucketlistForm() {
    this.setState({ editBucketlistForm: false });
  }

  handleUpdateBucketlist(event) {
    event.preventDefault();
    this.updateBucketlist(this.state.bucketlistId, this.state.bucketlistName);
    this.hideEditBucketlistForm();
  }

  updateBucketlist(bucketlistId, bucketlistName) {
    if (bucketlistName === '') {
      return;
    }
    request
      .put('/api/v1/bucketlists/'+bucketlistId)
      .type('form')
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .send({"name": bucketlistName})
      .end((err, result) => {
        if (result) {
          if (result.status === 200) {
            this.props.fetchAllBucketlists();
            return this.displayFlashMessage("Succesfully updated", "success")
          }
          var message = (("detail" in result.body) && !(result.body.detail === '')) ? result.body.detail : "Unable to update bucketlist"
          return this.displayFlashMessage(message, "danger")
        }
        return this.displayFlashMessage("An error occured", "danger")
      });
  }

  displayAllBucketlists() {
      if (this.props.bucketlists.length > 0) {
        return (
          this.props.bucketlists.map((bucketlist) => {
            return (
              this.displaySingleBucketlist(bucketlist, (this.props.bucketlists.indexOf(bucketlist)+1).toString())
            );
          })
        );
      }
      else {
        return (
          <div className="no-bucketlist">
            No bucketlist yet. Click the + sign above
            to start creating your bucketlist
          </div>
      );
      };

  }
  hideDeletePopover() {
    this.setState({ showDeletePopover: false })
  }

  displaySingleBucketlist(bucketlist, bucketlistIndex) {
    return (
      <Panel header={bucketlist.name + "(" + bucketlist.items.length +")"} eventKey={bucketlistIndex}             onClick={()=>this.onbucketlistClick(bucketlist.id, bucketlist.name)} >
        <div className="row"  key={bucketlist.id}>
          <div className="single-bucketlist">
            <div className="manage">
              <a onClick={()=>this.handleSaveNewBucketlistItem(bucketlist.id, bucketlist.name)}><span className="badge add-item" title="Add Items">Add items</span></a>
              <a onClick={()=>this.handleEditBucketlist(bucketlist.id, bucketlist.name)}><span className="badge edit-item" title="Edit this bucetlist">Edit</span></a>
              <OverlayTrigger
                trigger="click"
                container={document.body}
                placement="top"
                rootClose={true}
                target={() => ReactDOM.findDOMNode(this.refs.target)}
                show={this.state.showDeletePopover}
                onHide={() => this.setState({ showDeletePopover: false })}
                overlay={
                  <Popover id = {bucketlist.id} title="Do you really want to delete this bucketlist?">
                    <a style={{ 'marginLeft': 60, position: 'relative' }} className="btn btn-danger" onClick={()=>this.deleteBucketlist(bucketlist.id)}>Yes</a>
                    <a style={{ 'marginLeft': 30, position: 'relative' }} className="btn btn-primary"
                    onClick={() => this.hideDeletePopover()}>No</a>
                  </Popover>}>
                <a> <span className="badge btn delete-item" title="Delete this bucketlist">Delete</span></a>
              </OverlayTrigger>
            </div>
          </div>
        </div>
      </Panel>
    );
  }

  fetchBucketlistItems(bucketlistId) {
    request
      .get(`/api/v1/bucketlists/`+bucketlistId)
      .set('Authorization', 'Token ' + (JSON.parse(localStorage
            .getItem('token'))))
      .end((err, result) => {
        if (result.status === 200) {
          this.setState({
            items: result.body.items,
          });
        } else {
          this.setState({
            items: [],
          });
        }
      });
  }

  render() {

    let closeEditBucketlistForm = () => this.setState({ editBucketlistForm: false})
    let closeNewBucketistItemForm = () => this.setState({ newBucketlistItemForm: false });
    let closeNewBucketlistForm = () => this.setState({ newBucketlistForm: false });

    return(
      <div>
      <div><a className="new-bucket-list" onClick={this.showNewBucketlistForm} title="Create New Bucketlist"><span className="glyphicon glyphicon-plus-sign"></span></a></div>
        <div className="bucket-list">
          <Alert bsStyle={this.state.messageType} style={{display:this.state.displayFlashMessageStatus}}>
            {this.state.flashMessage}
          </Alert>
          <Panel header="My Bucketlists">
            <Accordion>
              {this.displayAllBucketlists()}
            </Accordion>
          </Panel>
          <Pagination
          prev
          next
          first
          last
          ellipsis
          items={this.props.bucketlistCount}
          maxButtons={5}
          activePage={this.state.activePage}
          onSelect={this.handleSelect}
          />
        </div>

        <div className="bucket-list-items">
          <BucketListItem
            bucketlistId = {this.state.bucketlistId}
            bucketlistName = {this.state.bucketlistName}
            items={this.state.items}
            fetchAllBucketlists={this.props.fetchAllBucketlists}
            fetchBucketlistItems={this.fetchBucketlistItems}
            newItemMessageType={this.state.newItemMessageType}
            newItemFlashMessage={this.state.newItemFlashMessage}
            displayNewItemMessageStatus={this.state.displayNewItemMessageStatus}
          />
        </div>

        <BucketListModalForm
          show={this.state.newBucketlistForm}
          onHide={closeNewBucketlistForm}
          handleFieldChange={this.handleFieldChange}
          onSave={this.handleSaveNewBucketlist}
          formName="newBucketListName"
          formtitle="Add Bucketlist"
          placeholder="Enter bucketlist name"
        />

        <BucketListModalForm
          show={this.state.editBucketlistForm}
          onHide={closeEditBucketlistForm}
          bucketlistName = {this.state.bucketlistName}
          handleFieldChange={this.handleFieldChange}
          onSave={this.handleUpdateBucketlist}
          formName="bucketlistName"
          formtitle="Edit Bucketlist"
        />

        <BucketListItemModalForm
          show={this.state.newBucketlistItemForm}
          onHide={closeNewBucketistItemForm}
          handleFieldChange={this.handleFieldChange}
          onSave={this.submitNewBucketlistItem}
          formtitle={"Add an item to " + this.state.bucketlistName}
          placeholder="Enter item name"
          required={true}
          displayEditItemFieldStatus="none"
        />

      </div>
    );
  }
}
