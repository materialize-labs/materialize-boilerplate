import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  InputGroup,
  Label,
  Row,
} from 'reactstrap';
import {
  ErrorMessage,
  Field,
} from 'formik';
import {
  InvalidErrorMessage,
  isInvalid,
} from '../../../helpers/forms';
import Editor from '../../Forms/Editor';
import NameFormFields from './FormSections/NameFormFields';
import InfoFormFields from './FormSections/InfoFormFields';
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
  status: PropTypes.shape({
    errors: PropTypes.string,
  }),
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  closeModal: PropTypes.func,
  contacts: PropTypes.arrayOf(PropTypes.shape({})),
  formFields: PropTypes.shape({
    individual_sub_types: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

const defaultProps = {
  closeModal: () => {
  },
  status: {},
  contacts: {},
  formFields: {},
};

const IndividualForm = (props) => {
  const {
    touched,
    errors,
    status,
    setFieldValue,
    setFieldTouched,
    values,
    contacts,
    formFields,
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
          <Row className="mb-md-4">
            <Col md={6} className="mb-4 mb-md-0">
              <Card className="h-100 mb-md-0">
                <CardHeader>
                  Name
                </CardHeader>
                <CardBody>
                  <NameFormFields {...props} />
                </CardBody>
              </Card>
            </Col>

            <Col md={6} className="mb-4 mb-md-0">
              <Card className="h-100 mb-md-0">
                <CardHeader>
                  Affiliations
                </CardHeader>
                <CardBody>

                  <Label for="sub_type">Sub Type</Label>
                  <div
                    className="mb-1"
                    style={{
                      fontSize: '80%',
                    }}
                  >
                    To create a new sub-type, enter the name and select &quot;Create&quot;
                  </div>
                  <InputGroup className="mb-3">
                    <div style={{ width: '100%' }}>
                      <CreatableSelect
                        id="sub_type"
                        value={values.sub_type}
                        onChange={option => setFieldValue('sub_type', option)}
                        options={formFields.individual_sub_types}
                        invalid={isInvalid('sub_type', touched, errors)}
                        isClearable
                      />
                      <ErrorMessage name="type">
                        {subTypeErrors => (
                          <div
                            className="invalid-feedback"
                            style={{ display: 'block' }}
                          >
                            {subTypeErrors.label}
                          </div>
                        )}
                      </ErrorMessage>
                    </div>
                  </InputGroup>

                  <Label for="business_name">Business Name</Label>
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
                  <Label for="title">Title</Label>
                  <InputGroup className="mb-3">
                    <Input
                      type="text"
                      autoComplete="title"
                      tag={Field}
                      component="input"
                      name="title"
                      invalid={isInvalid('title', touched, errors)}
                    />
                    <InvalidErrorMessage name="title" />
                  </InputGroup>
                  <Label for="professional_title">Professional Title</Label>
                  <InputGroup className="mb-3">
                    <Input
                      type="text"
                      autoComplete="professional_title"
                      tag={Field}
                      component="input"
                      name="professional_title"
                      invalid={isInvalid('professional_title', touched, errors)}
                    />
                    <InvalidErrorMessage name="professional_title" />
                  </InputGroup>


                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <Card>
                <CardHeader>
                  Info
                </CardHeader>
                <CardBody>
                  <InfoFormFields {...props} />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
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
                  <Label for="referralSources">Referral Sources</Label>
                  <InputGroup className="mb-3">
                    <div style={{ width: '100%' }}>
                      <Select
                        isMulti
                        name="referralSources"
                        options={primaryContacts}
                        value={values.referralSources}
                        onChange={value => setFieldValue('referralSources', value)}
                      />
                      <InvalidErrorMessage name="referralSources" />
                    </div>
                  </InputGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
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
                  </InputGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <div className="float-right mt-3">
            { !_.isEmpty(errors)
              && (
                <div
                  className="invalid-feedback mb-3"
                  style={{ display: 'block' }}
                >
Fix the form errors above
                </div>
              )
            }
            <Button color="danger" onClick={props.closeModal}>Cancel</Button>
            <Button
              color="success"
              type="submit"
              style={{ minWidth: '200px' }}
              className="ml-2"
              disabled={!_.isEmpty(errors)}
            >
              Submit
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

IndividualForm.propTypes = propTypes;
IndividualForm.defaultProps = defaultProps;

export default IndividualForm;
