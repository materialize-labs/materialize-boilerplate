import React from 'react';
import {
  Table,
} from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  contact: PropTypes.objectOf(PropTypes.any).isRequired,
};

const InfoData = (props) => {
  const { contact } = props;

  return (
    <Table responsive>
      <tbody>
        <tr>
          <td><span className="ft-bold">Sex</span></td>
          { contact.sex
            ? <td>{contact.sex}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">Language</span></td>
          { contact.language
            ? <td>{contact.language}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">DOB</span></td>
          { contact.dob
            ? <td>{contact.dob}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">SSN</span></td>
          { contact.ssn
            ? <td>{contact.ssn}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">Marital Status</span></td>
          { contact.marital_status
            ? <td>{contact.marital_status}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">Spouse</span></td>
          { contact.spouse
            ? <td>{contact.spouse}</td>
            : <td>NA</td>
          }
        </tr>
      </tbody>
    </Table>
  );
};

InfoData.propTypes = propTypes;

export default InfoData;
