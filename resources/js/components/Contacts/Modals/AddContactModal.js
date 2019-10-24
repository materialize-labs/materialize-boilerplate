import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from 'reactstrap';
import withUnmounted from '@ishawnwang/withunmounted';
import ContactFormWrapper from '../Forms/ContactFormWrapper';
import { ADD_CONTACT } from '../../../graphql/Mutations/contacts';

const propTypes = {
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
    }),
  }),
  type: PropTypes.string,
  refetch: PropTypes.func,
  contacts: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  session: {},
  type: '',
  refetch: () => { },
  contacts: {},
};

class AddContactModal extends React.Component {
  hasUnmounted = false;

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (this.hasUnmounted) {
      // No need to toggle. It's already been unmounted.
      return;
    }
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const {
      type,
      contacts,
      refetch,
      session,
    } = this.props;

    const modifiedContacts = [{ id: '0', fullName: 'Self' }, ...contacts];

    return (
      <div>
        <Button
          size="sm"
          color="primary"
          className="ml-1 mr-1 ft-white"
          title="Add Contact"
          onClick={this.toggle}
        >
          <i className="fa fa-user-plus mr-2 ft-14" aria-hidden="true" />
          <span className="ft-14">Add Contact</span>
        </Button>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="modal-xl"
          fade={false}
        >
          <Row>
            <Col>
              <ModalHeader toggle={this.toggle}>
                {type}
                {' '}
                Contact
              </ModalHeader>
              <ModalBody>
                <ContactFormWrapper
                  contacts={modifiedContacts}
                  refetch={refetch}
                  closeModal={this.toggle}
                  mutation={ADD_CONTACT}
                  session={session}
                />
              </ModalBody>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

AddContactModal.propTypes = propTypes;
AddContactModal.defaultProps = defaultProps;

export default withUnmounted(AddContactModal);
