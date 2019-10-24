import React from 'react';
import {
  Col,
  Form,
  InputGroup,
  Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withApollo } from 'react-apollo';
import IndividualForm from './IndividualForm';
import CompanyForm from './CompanyForm';
import ContactFormLogic from './ContactFormLogic';
import withSession from '../../../hocs/withSession';

const options = [
  { value: 'individual', label: 'Individual' },
  { value: 'company', label: 'Company' },
];

const propTypes = {
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
};

const ContactForm = (props) => {
  const {
    values,
    setFieldValue,
    handleSubmit,
  } = props;

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <div className="text-center"><h2>Contact Type</h2></div>
            <InputGroup className="mb-3">
              <div style={{ width: '100%' }}>
                <Select
                  id="type"
                  value={values.type}
                  onChange={option => setFieldValue('type', option)}
                  options={options}
                  name="type"
                  placeholder="Select type"
                />
              </div>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            {values.type && values.type.value === 'individual' && (<IndividualForm {...props} />)}
            {values.type && values.type.value === 'company' && (<CompanyForm {...props} />)}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

ContactForm.propTypes = propTypes;

export default withApollo(withSession(ContactFormLogic(ContactForm)));
