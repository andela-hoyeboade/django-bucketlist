import React,  { Component } from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './dashboard.jsx';
import request from 'superagent';
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
    Modal
} from 'react-bootstrap';

export default class BucketListItemModalForm extends Component {
  constructor() {
    super();
    this.getDoneStatusValue = this.getDoneStatusValue.bind(this);
    }

  getDoneStatusValue(itemDoneStatus) {
    if (itemDoneStatus === undefined) {
      return;
    }
    else if (itemDoneStatus.toString().toLowerCase() === "true") {
      return ("Done")
    }
    else {
      return("Not done")
    }
  }

  render() {
    return (
      <div className="item-modal-form">
        <Modal {...this.props} bsSize="small" aria-labelledby="contained-modal-title-sm">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-sm">{this.props.formtitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form action="post" onSubmit={this.props.onSave} className="buck">

              <FormGroup>
              <Col><strong>Name:</strong>
              <FormControl
                  name="itemName" type="text" value = {this.props.itemName} required = {this.props.required} placeholder={this.props.placeholder} onChange={this.props.handleFieldChange}
                />
              </Col>
              </FormGroup>
                <div style={{display: this.props.displayEditItemFieldStatus}}>
                  <FormGroup >
                    <Col><strong>Status: &nbsp;</strong> {this.getDoneStatusValue(this.props.itemDoneStatus)}
                      <Button className="badge btn-change-item-status" onClick={() => this.props.changeItemDoneStatus()}>Change</Button>
                    </Col>
                  </FormGroup>
                </div>
          <Modal.Footer>
            <FormGroup>
            <Button onClick={this.props.onHide}>Close</Button>
            <Button type="submit" className="btn btn-primary">Save</Button>
            </FormGroup>

          </Modal.Footer>
          </Form>
          </Modal.Body>

        </Modal>
      </div>
    );
  }
}
