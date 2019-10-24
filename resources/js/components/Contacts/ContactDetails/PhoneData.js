import React from 'react';
import {
  Table, Badge,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const propTypes = {
  contact: PropTypes.objectOf(PropTypes.any).isRequired,
};

function renderFormattedPhone(phoneNumber) {
  const formattedNumber = parsePhoneNumberFromString(phoneNumber);
  return (
    <span>
      {formattedNumber.formatNational()}
    </span>
  );
}

const PhoneData = (props) => {
  const { contact } = props;

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Phone Number</th>
          <th>Type</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {contact.phoneNumbers.map(phoneNumber => (
          <tr key={phoneNumber.id}>
            <td>
              { phoneNumber.is_primary === 1
                  && <span className="mr-2"><Badge color="success">PRIMARY</Badge></span>
              }
              {renderFormattedPhone(phoneNumber.phone_number)}
            </td>
            <td>{phoneNumber.type ? phoneNumber.type.label : '-'}</td>
            <td>{phoneNumber.notes ? phoneNumber.notes : '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

PhoneData.propTypes = propTypes;

export default PhoneData;
