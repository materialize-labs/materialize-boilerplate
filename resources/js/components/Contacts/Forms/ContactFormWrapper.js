import React from 'react';
import PropTypes from 'prop-types';
import {
  Mutation,
  Query,
} from 'react-apollo/index';
import { GET_CONTACT_FORM_FIELDS } from '../../../graphql/Queries/contacts';
import ContactForm from './ContactForm';

const propTypes = {
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
      organization: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }),
  refetch: PropTypes.func,
  closeModal: PropTypes.func,
  contacts: PropTypes.arrayOf(PropTypes.shape({})),
  contact: PropTypes.shape({
    type: PropTypes.string,
  }),
  mutation: PropTypes.shape({
    kind: PropTypes.string,
  }).isRequired,
};

const defaultProps = {
  session: {},
  closeModal: () => {
  },
  refetch: () => {
  },
  contacts: {},
  contact: {},
};

const ContactFormWrapper = (props) => {
  const {
    contacts,
    closeModal,
    refetch,
    contact,
    mutation,
    session,
  } = props;

  return (
    <div>
      <Query
        query={GET_CONTACT_FORM_FIELDS}
        variables={{ organization_id: session.me.organization.id }}
      >

        {(formFieldsRes) => {
          if (formFieldsRes.loading) return 'Loading...';
          if (formFieldsRes.error) return `Error! ${formFieldsRes.error.message}`;
          const { contactFormFields } = formFieldsRes.data;
          return (
            <div>
              <Mutation mutation={mutation} errorPolicy="all">
                {contactMutation => (
                  <ContactForm
                    formFields={contactFormFields}
                    contacts={contacts}
                    tableRefetch={refetch}
                    formFieldsRefetch={formFieldsRes.refetch}
                    closeModal={closeModal}
                    mutation={contactMutation}
                    contact={contact}
                  />
                )}
              </Mutation>
            </div>
          );
        }}
      </Query>
    </div>
  );
};

ContactFormWrapper.propTypes = propTypes;
ContactFormWrapper.defaultProps = defaultProps;

export default ContactFormWrapper;
