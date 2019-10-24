import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row,
} from 'reactstrap';
import {
  Field,
} from 'formik';
import {
  InvalidErrorMessage,
  isInvalid,
} from '../../../helpers/forms';
import Editor from '../../Forms/Editor';
import ContactInfoFormFields from './FormSections/ContactInfoFormFields';
import AddressFormFields from './FormSections/AddressFormFields';

const propTypes = {
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  errors: PropTypes.shape({}).isRequired,
  touched: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      label: PropTypes.bool,
      value: PropTypes.bool,
    }),
    PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.bool,
      value: PropTypes.bool,
    })),
    PropTypes.arrayOf(PropTypes.bool),
  ])).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  status: PropTypes.shape({
    errors: PropTypes.string,
  }),
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  closeModal: PropTypes.func,
  contacts: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  closeModal: () => {
  },
  status: {},
  contacts: {},
};

const CompanyForm = (props) => {
  const {
    touched,
    errors,
    status,
    setFieldValue,
    setFieldTouched,
    values,
    contacts,
  } = props;

  const primaryContacts = contacts.map(contact => ({
    value: contact.id,
    label: contact.fullName,
  }));

  return (
    <div>
      <Row>
        <Col>
          {status.errors ? (<Alert color="danger">{status.errors}</Alert>) : ''}
          <Row>
            <Col sm="12" className="mb-1">
              <Card>
                <CardHeader>
                  Info
                </CardHeader>
                <CardBody>
                  <Row className="align-items-center">
                    <Col lg="4">
                      <Label for="business_name">Business Name*</Label>
                      <InputGroup className="mb-3">
                        <Input
                          type="text"
                          autoComplete="business_name"
                          tag={Field}
                          component="input"
                          name="business_name"
                          invalid={isInvalid('business_name', touched, errors)}
                        />
                        <InvalidErrorMessage name="business_name" />
                      </InputGroup>
                    </Col>

                    <Col lg="3">
                      <FormGroup check className="checkbox">
                        <Label check className="form-check-label">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            tag={Field}
                            component="input"
                            name="is_lead"
                            invalid={isInvalid('is_lead', touched, errors)}
                            checked={!!values.is_lead}
                          />
                          Lead?
                        </Label>
                        <InvalidErrorMessage name="is_lead" />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  Contact
                </CardHeader>
                <CardBody>
                  <ContactInfoFormFields {...props} />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className="mb-md-4">
            <Col md={6} className="mb-4 mb-md-0">
              <Card className="mb-md-0 h-100">
                <CardHeader>
                  Addresses
                </CardHeader>
                <CardBody>
                  <AddressFormFields {...props} />
                </CardBody>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <CardHeader>
                  Relationships
                </CardHeader>
                <CardBody>
                  <Label for="primary_contact">Primary Contact</Label>
                  <InputGroup className="mb-3">
                    <div style={{ width: '100%' }}>
                      <Select
                        id="primary_contact"
                        value={values.primary_contact}
                        onChange={option => setFieldValue('primary_contact', option)}
                        options={primaryContacts}
                        invalid={isInvalid('primary_contact', touched, errors)}
                        isClearable
                      />
                    </div>
                  </InputGroup>
                  <Label for="referral_sources">Referral Source</Label>
                  <InputGroup className="mb-3">
                    <div style={{ width: '100%' }}>
                      <Input
                        type="text"
                        autoComplete="referral_sources"
                        tag={Field}
                        component="input"
                        name="referral_sources"
                        invalid={isInvalid('referral_sources', touched, errors)}
                      />
                      <InvalidErrorMessage name="referral_source" />
                    </div>
                  </InputGroup>
                </CardBody>
              </Card>
              <Card className="mb-md-0">
                <CardHeader>
                  Miscellaneous
                </CardHeader>
                <CardBody>
                  <Label for="notes">Notes</Label>
                  <InputGroup className="mb-3">
                    <Editor
                      name="notes"
                      value={values.notes}
                      onChangeCallback={(value, field) => setFieldValue(field, value)}
                      onBlurCallback={field => setFieldTouched(field)}
                    />
                    <InvalidErrorMessage name="notes" />
                  </InputGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <div className="float-right mt-3">
            <Button color="danger" onClick={props.closeModal}>Cancel</Button>
            <Button
              color="success"
              type="submit"
              style={{ minWidth: '200px' }}
              disabled={!_.isEmpty(errors)}
              className="ml-2"
            >
              Submit
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

CompanyForm.propTypes = propTypes;
CompanyForm.defaultProps = defaultProps;

export default CompanyForm;
