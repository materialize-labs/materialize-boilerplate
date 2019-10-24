import React from 'react';
import {
  Table, Badge,
} from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  contact: PropTypes.objectOf(PropTypes.any).isRequired,
};

const AddressData = (props) => {
  const { contact } = props;

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Address</th>
          <th>Type</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {contact.addresses.map(address => (
          <tr key={address.id}>
            <td>
              { address.is_primary === 1
                  && <div className="mr-2"><Badge color="success">PRIMARY</Badge></div>
              }
              <div>{address.street}</div>
              <div>
                {address.city}
,
                {' '}
                {address.state_abbr}
                {' '}
                {address.post_code}
              </div>
            </td>
            <td>{address.type ? address.type.label : '-'}</td>
            <td>{address.notes ? address.notes : '-'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

AddressData.propTypes = propTypes;

export default AddressData;
