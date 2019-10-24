import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Input,
} from 'reactstrap';
// import { parseGraphqlErrors } from '../../helpers';

const propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  submitDelete: PropTypes.func,
  confirm: PropTypes.bool,
  mutation: PropTypes.func.isRequired,
};

const defaultProps = {
  id: '',
  type: 'danger',
  submitDelete: null,
  confirm: true,
};

class DeleteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      disabled: true,
    };

    this.toggle = this.toggle.bind(this);
    this.checkIfDeleteAllowed = this.checkIfDeleteAllowed.bind(this);
    this.submitDelete = this.submitDelete.bind(this);
    this.deleteAction = this.deleteAction.bind(this);
  }

  toggle() {
    const { confirm } = this.props;
    if (confirm) {
      this.setState({
        modal: !this.state.modal,
      });
    } else {
      this.deleteAction();
    }
  }

  checkIfDeleteAllowed(e) {
    const deleteEntered = e.target.value === 'DELETE';
    this.setState({ disabled: !deleteEntered });
  }

  submitDelete() {
    const { mutation } = this.props;
    this.setState({ disabled: true });

    mutation({ variables: { id: this.props.id } }).then(async () => true)
      .catch((error) => {
        if (error.graphQLErrors) {
          // const { serverErrors, validationErrors } = parseGraphqlErrors(error);
        }
      });
  }

  deleteAction() {
    this.submitDelete();
    // if (!deleteStatus) {
    //   console.log('There was an error deleting that resource');
    // }
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const {
      type,
      id,
      ...props
    } = this.props;
    delete props.submitDelete;
    delete props.confirm;

    return (
      <Fragment>
        <div
          className="h-100 align-items-center d-flex trash"
          onClick={this.toggle}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
        >
          <i className="fa fa-trash" aria-hidden="true" />
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          fade={false}
        >
          <ModalHeader toggle={this.toggle}>Delete Resource</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete this resource?
              This can&apos;t be undone.
            </p>
            <p>
              To delete this resource, type the word &quot;DELETE&quot; into the input field below.
            </p>
            <FormGroup>
              <Input placeholder="DELETE" onChange={this.checkIfDeleteAllowed} />
            </FormGroup>
            <Button color="danger" block disabled={this.state.disabled} onClick={this.deleteAction}>Delete</Button>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

DeleteModal.propTypes = propTypes;
DeleteModal.defaultProps = defaultProps;

export default DeleteModal;
