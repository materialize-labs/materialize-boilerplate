import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import {
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
} from 'reactstrap';
import {
  UPDATE_USER,
  CHANGE_PASSWORD,
} from '../../graphql/mutations';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';

const propTypes = {
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
    }),
  }),
};

const defaultProps = {
  session: {},
};

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  render() {
    const { session } = this.props;
    return (
      <div className="">
        <div className="d-flex justify-content-between">
          <div className="ft-26 ft-bold mb-3">Edit Profile</div>
          <div>
            <Button
              size="sm"
              color="primary"
              className="ml-1 mr-1 ft-white"
              title="Change Password"
              onClick={this.toggle}
            >
              <span className="ft-14">Change Password</span>
            </Button>
          </div>
        </div>
        <Row>
          <Col>
            <div>
              <Mutation mutation={UPDATE_USER} errorPolicy="all">
                {updateUser => (
                  <div>
                    <ProfileForm
                      mutation={updateUser}
                      session={session}
                    />
                  </div>
                )}
              </Mutation>
            </div>
          </Col>
        </Row>

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="modal-md"
          fade={false}
        >
          <ModalHeader toggle={this.toggle}>Change Password</ModalHeader>
          <Mutation mutation={CHANGE_PASSWORD} errorPolicy="all">
            {changePassword => (
              <div>
                <ChangePasswordForm
                  user={session.me}
                  close={this.toggle}
                  mutation={changePassword}
                />
              </div>
            )}
          </Mutation>
        </Modal>
      </div>
    );
  }
}

EditProfile.propTypes = propTypes;
EditProfile.defaultProps = defaultProps;

export default EditProfile;
