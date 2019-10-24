import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import {
  Col,
  Row,
  Button,
  Modal,
} from 'reactstrap';
import UsersTable from './UsersTable';
import { GET_ORGANIZATION_USERS } from '../../graphql/queries';
import { INVITE_USER } from '../../graphql/mutations';
import UserForm from './UserForm';

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

class Users extends Component {
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
          <div className="ft-26 ft-bold mb-3">Users</div>
          <div>
            <Button
              size="sm"
              color="primary"
              className="ml-1 mr-1 ft-white"
              title="Invite User"
              onClick={this.toggle}
            >
              <i className="fa fa-user-plus mr-2 ft-14" aria-hidden="true" />
              <span className="ft-14">Invite User</span>
            </Button>
          </div>
        </div>
        <Row>
          <Col>
            <div>
              <Query query={GET_ORGANIZATION_USERS}>
                {({
                  loading, error, data, refetch,
                }) => {
                  if (loading) return 'Loading...';
                  if (error) return `Error! ${error.message}`;
                  return (
                    <div>
                      <UsersTable users={data.orgUsers} />
                      <Modal
                        isOpen={this.state.modal}
                        toggle={this.toggle}
                        className="modal-lg"
                        fade={false}
                      >
                        <Mutation mutation={INVITE_USER} errorPolicy="all">
                          {inviteUser => (
                            <div>
                              <UserForm
                                closeModal={this.toggle}
                                type="Add"
                                mutation={inviteUser}
                                refetch={refetch}
                                session={session}
                              />
                            </div>
                          )}
                        </Mutation>
                      </Modal>
                    </div>
                  );
                }}
              </Query>
            </div>
          </Col>
        </Row>

      </div>
    );
  }
}

Users.propTypes = propTypes;
Users.defaultProps = defaultProps;

export default Users;
