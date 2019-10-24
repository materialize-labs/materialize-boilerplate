import React from 'react';
import {
  Table,
} from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  contact: PropTypes.objectOf(PropTypes.any).isRequired,
};

const NameData = (props) => {
  const { contact } = props;

  return (
    <Table responsive>
      <tbody>
        <tr>
          <td><span className="ft-bold">Full Name</span></td>
          <td>{contact.fullName}</td>
        </tr>
        <tr>
          <td><span className="ft-bold">Middle Name</span></td>
          { contact.middle_name
            ? <td>{contact.middle_name}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">Suffix</span></td>
          { contact.suffix
            ? <td>{contact.suffix}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">Nickname</span></td>
          { contact.nickname
            ? <td>{contact.nickname}</td>
            : <td>NA</td>
          }
        </tr>
      </tbody>
    </Table>
  );
};

NameData.propTypes = propTypes;

export default NameData;
