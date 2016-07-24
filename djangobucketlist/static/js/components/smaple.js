const BucketListModalForm = (props) => {
   render() {
     return (
       <Modal {...this.props} bsSize="small" aria-labelledby="contained-modal-title-sm">
         <Modal.Header closeButton>
           <Modal.Title id="contained-modal-title-sm">{this.props.formtitle}</Modal.Title>
         </Modal.Header>
         <Modal.Body>
         <Form action="post" onSubmit={this.props.onSave} className="buck">

         <FormGroup><Col>Name:</Col>
         <FormControl
           name="bucketlistName" value={this.props.bucketlistName} type="text" required = {true} placeholder={this.props.placeholder} onChange={this.props.handleFieldChange}
         />
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
