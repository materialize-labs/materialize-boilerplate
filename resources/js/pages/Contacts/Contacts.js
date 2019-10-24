import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import ContactsTable from '../../components/Contacts/ContactsTable';
import { GET_ORGANIZATION_CONTACTS } from '../../graphql/Queries/contacts';
import AddContactModal from '../../components/Contacts/Modals/AddContactModal';

const propTypes = {
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
      organization: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }),
};

const defaultProps = {
  session: {},
};

class Contacts extends Component {
  render() {
    const { session } = this.props;
    return (
      <div>
        <Query
          query={GET_ORGANIZATION_CONTACTS}
          variables={{ organization_id: session.me.organization.id }}
        >
          {({
            loading, error, data, refetch,
          }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;
            return (
              <div>
                <div className="d-flex justify-content-between">
                  <div className="ft-26 ft-bold mb-3">Contacts</div>
                  <div>
                    <AddContactModal
                      type="Add"
                      session={session}
                      contacts={data.contacts}
                      refetch={refetch}
                    />
                  </div>
                </div>

                <div>
                  <ContactsTable contacts={data.contacts} refetch={refetch} />
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

Contacts.propTypes = propTypes;
Contacts.defaultProps = defaultProps;

export default Contacts;
