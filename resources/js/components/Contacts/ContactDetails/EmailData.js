import React from 'react';
import {
  Table, Badge,
} from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  contact: PropTypes.objectOf(PropTypes.any).isRequired,
};

const EmailData = (props) => {
  const { contact } = props;

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Email</th>
          <th>Type</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {contact.emails.map(email => (
          <tr key={email.id}>
            <td>
              { email.is_primary === 1
                  && <span className="mr-2"><Badge color="success">PRIMARY</Badge></span>
              }
              {email.email}
            </td>
            <td>{email.type ? email.type.label : '-'}</td>
            <td>{email.notes ? email.notes : '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

EmailData.propTypes = propTypes;

export default EmailData;
