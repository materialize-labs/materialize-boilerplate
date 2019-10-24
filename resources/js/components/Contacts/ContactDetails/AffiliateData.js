import React from 'react';
import {
  Table,
} from 'reactstrap';
import PropTypes from 'prop-types';

const propTypes = {
  contact: PropTypes.objectOf(PropTypes.any).isRequired,
};

const AffiliateData = (props) => {
  const { contact } = props;

  return (
    <Table responsive>
      <tbody>
        <tr>
          <td><span className="ft-bold">Business Name</span></td>
          { contact.business_name
            ? <td>{contact.business_name}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">Title</span></td>
          { contact.title
            ? <td>{contact.title}</td>
            : <td>NA</td>
          }
        </tr>
        <tr>
          <td><span className="ft-bold">Professional Title</span></td>
          { contact.professional_title
            ? <td>{contact.professional_title}</td>
            : <td>NA</td>
          }
        </tr>
      </tbody>
    </Table>
  );
};

AffiliateData.propTypes = propTypes;

export default AffiliateData;
