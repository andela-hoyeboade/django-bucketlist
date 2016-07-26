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

export default class BucketListModalForm extends Component{
  render(){
    return (
      <Modal {...this.props} bsSize="small" aria-labelledby="contained-modal-title-sm">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-sm">{this.props.formtitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form action="post" onSubmit={this.props.onSave} className="buck">

        <FormGroup>
          <Col><strong>Name: </strong>
            <FormControl
              name={this.props.formName} value={this.props.bucketlistName} type="text" required = {true} placeholder={this.props.placeholder} onChange={this.props.handleFieldChange}
            />
          </Col>        
        </FormGroup>

        <Modal.Footer>
          <FormGroup>
          <Button onClick={this.props.onHide}>Close</Button>
          <Button type="submit" className="btn btn-primary">Save</Button>
          </FormGroup>

        </Modal.Footer>
        </Form>
        </Modal.Body>

      </Modal>
    );
  }
}
