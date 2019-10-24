import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import withUnmounted from '@ishawnwang/withunmounted';
import ContactFormWrapper from '../Forms/ContactFormWrapper';
import { UPDATE_CONTACT } from '../../../graphql/Mutations/contacts';

const propTypes = {
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
    }),
  }),
  type: PropTypes.string,
  refetch: PropTypes.func,
  contacts: PropTypes.arrayOf(PropTypes.shape({})),
  contact: PropTypes.shape({}),
  button: PropTypes.string,
};

const defaultProps = {
  session: {},
  type: '',
  refetch: () => { },
  contacts: {},
  contact: {},
  button: 'table',
};

class EditContactModal extends React.Component {
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
      contact,
      button,
      session,
    } = this.props;

    return (
      <div>
        { button === 'table'
          ? (
            <div
              className="h-100 align-items-center d-flex edit"
              onClick={this.toggle}
              onKeyDown={e => e.preventDefault()}
              role="button"
              tabIndex={0}
            >
              <i className="fa fa-edit" aria-hidden="true" />
            </div>
          )
          : (
            <Button
              size="sm"
              color="primary"
              className="ml-1 mr-1 ft-white"
              title="Edit Contact"
              onClick={this.toggle}
            >
              <i className="fa fa-edit mr-2 ft-14" aria-hidden="true" />
              <span className="ft-14">Edit Contact</span>
            </Button>
          )
        }
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
                  contacts={contacts}
                  refetch={refetch}
                  closeModal={this.toggle}
                  contact={contact}
                  mutation={UPDATE_CONTACT}
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

EditContactModal.propTypes = propTypes;
EditContactModal.defaultProps = defaultProps;

export default withUnmounted(EditContactModal);
