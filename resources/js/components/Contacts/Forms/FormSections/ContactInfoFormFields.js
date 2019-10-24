import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-number-input';
import {
  Button,
  Col,
  Input,
  InputGroup,
  Label,
  Row,
} from 'reactstrap';
import {
  Field,
  FieldArray,
} from 'formik';
import {
  InvalidErrorMessage,
  isInvalid,
} from '../../../../helpers/forms';

const propTypes = {
  values: PropTypes.objectOf(PropTypes.any).isRequired,
  errors: PropTypes.shape({
    phoneNumbers: PropTypes.arrayOf(
      PropTypes.shape({
        phone_number: PropTypes.string,
      }),
    ),
  }).isRequired,
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
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  formFields: PropTypes.shape({
    contact_types: PropTypes.arrayOf(
      PropTypes.shape({
        emails: PropTypes.arrayOf(PropTypes.shape()),
        phone_numbers: PropTypes.arrayOf(PropTypes.shape()),
      }),
    ),
  }),
};

const defaultProps = {
  formFields: {},
};

class ContactInfoFormFields extends Component {
  constructor(props) {
    super(props);
    this.handlePrimaryChange = this.handlePrimaryChange.bind(this);
  }

  handlePrimaryChange(key, index) {
    const {
      setFieldValue,
      values,
    } = this.props;
    const mappedValues = values[key].map((currentItem, i) => {
      if (index === i) {
        currentItem.is_primary = 1;
      } else {
        currentItem.is_primary = 0;
      }
      return currentItem;
    });

    setFieldValue(key, mappedValues);
  }

  render() {
    const {
      touched,
      errors,
      setFieldValue,
      values,
      formFields,
      setFieldTouched,
    } = this.props;

    const { emails: emailTypes, phone_numbers: phoneNumberTypes } = formFields.contact_types;

    return (
      <div>
        <Row>
          <Col lg={12}>
            <Label for="emails">Emails</Label>
            <FieldArray
              name="emails"
              render={arrayHelpers => (
                <div>
                  {values.emails.map((email, index) => {
                    const key = `emails.${index}`;
                    return (
                      <Row key={key}>
                        <Col lg={12}>
                          <Row>
                            <Col lg={5}>
                              <InputGroup className="mb-3">
                                <Input
                                  type="text"
                                  tag={Field}
                                  component="input"
                                  name={`${key}.email`}
                                  invalid={isInvalid(`${key}.email`, touched, errors)}
                                />
                                <InvalidErrorMessage name={`${key}.email`} />
                              </InputGroup>
                            </Col>

                            <Col lg={1}>
                              <InputGroup className="mb-3">
                                <Label check className="form-check-label ml-4">
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    tag={Field}
                                    component="input"
                                    name={`${key}.is_primary`}
                                    onChange={() => this.handlePrimaryChange('emails', index)}
                                    checked={!!values.emails[index].is_primary}
                                  />
                                  Primary
                                </Label>
                                <InvalidErrorMessage name={`${key}.is_primary`} />
                              </InputGroup>
                            </Col>

                            <Col lg={2}>
                              <InputGroup className="mb-3">
                                <div style={{ width: '100%' }}>
                                  <Select
                                    id="type"
                                    value={values.emails[index].type}
                                    onChange={option => setFieldValue(`${key}.type`, option)}
                                    options={emailTypes}
                                    isClearable
                                    name={`${key}.type`}
                                    placeholder="Type..."
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    }}
                                  />
                                </div>

                                <InvalidErrorMessage name={`${key}.type`} />
                              </InputGroup>
                            </Col>

                            <Col lg={3}>
                              <InputGroup className="mb-3">
                                <InputGroup className="mb-3">
                                  <Input
                                    type="textarea"
                                    tag={Field}
                                    component="textarea"
                                    name={`${key}.notes`}
                                    placeholder="Notes..."
                                  />
                                </InputGroup>
                              </InputGroup>
                            </Col>

                            {index > 0
                            && (
                              <Col lg={1}>
                                <Button
                                  size="sm"
                                  color="danger"
                                  className="ft-white ml-2 mt-1"
                                  style={{ width: '27px', height: '25px', top: '2px' }}
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <i className="fa fa-minus ft-10" aria-hidden="true" />
                                </Button>
                              </Col>
                            )
                            }
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
                  <Button
                    size="sm"
                    color="primary"
                    className="ft-white mb-2"
                    title="Add Email"
                    onClick={() => arrayHelpers.push({
                      email: '',
                      is_primary: '',
                      type: '',
                      notes: '',
                    })}
                  >
                    <i className="fa fa-plus ft-10 mr-2" aria-hidden="true" />
                    <span className="ft-14">Add Email</span>
                  </Button>
                </div>
              )}
            />
          </Col>

          <Col lg={12} className="mt-2">
            <Label for="phone_number">Phone Number</Label>

            <FieldArray
              name="phoneNumbers"
              render={arrayHelpers => (
                <div>
                  {values.phoneNumbers.map((phoneNumber, index) => {
                    const key = `phoneNumbers.${index}`;
                    return (
                      <Row key={key}>
                        <Col lg={12}>
                          <Row>
                            <Col lg={5}>
                              <InputGroup className="mb-3">
                                <PhoneInput
                                  country="US"
                                  countries={['US']}
                                  international={false}
                                  placeholder="Enter phone number"
                                  value={values.phoneNumbers[index].phone_number}
                                  name={`${key}.phone_number`}
                                  onChange={(phone) => {
                                    const cleanedPhone = phone || '';
                                    setFieldValue(`${key}.phone_number`, cleanedPhone);
                                  }}
                                  onBlur={() => setFieldTouched(`${key}.phone_number`, true)}
                                  error={(isInvalid(`${key}.phone_number`, touched, errors)) ? errors.phoneNumbers[index].phone_number : ''}
                                />
                              </InputGroup>
                            </Col>

                            <Col lg={1}>
                              <InputGroup className="mb-3">
                                <Label check className="form-check-label ml-4">
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    tag={Field}
                                    component="input"
                                    name={`${key}.is_primary`}
                                    onChange={() => this.handlePrimaryChange('phoneNumbers', index)}
                                    checked={!!values.phoneNumbers[index].is_primary}
                                  />
                                  Primary
                                </Label>
                                <InvalidErrorMessage name={`${key}.is_primary`} />
                              </InputGroup>
                            </Col>

                            <Col lg={2}>
                              <InputGroup className="mb-3">
                                <div style={{ width: '100%' }}>
                                  <Select
                                    id="type"
                                    value={values.phoneNumbers[index].type}
                                    onChange={option => setFieldValue(`${key}.type`, option)}
                                    options={phoneNumberTypes}
                                    isClearable
                                    name={`${key}.type`}
                                    placeholder="Type..."
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                                    }}
                                  />
                                </div>

                                <InvalidErrorMessage name={`${key}.type`} />
                              </InputGroup>
                            </Col>

                            <Col lg={3}>
                              <InputGroup className="mb-3">
                                <InputGroup className="mb-3">
                                  <Input
                                    type="textarea"
                                    tag={Field}
                                    component="textarea"
                                    name={`${key}.notes`}
                                    placeholder="Notes..."
                                  />
                                </InputGroup>
                              </InputGroup>
                            </Col>

                            {index > 0
                            && (
                              <Col lg={1}>
                                <Button
                                  size="sm"
                                  color="danger"
                                  className="ft-white ml-2 mt-1"
                                  style={{ width: '27px', height: '25px', top: '2px' }}
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <i className="fa fa-minus ft-10" aria-hidden="true" />
                                </Button>
                              </Col>
                            )
                            }
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
                  <Button
                    size="sm"
                    color="primary"
                    className="ft-white mb-2"
                    title="Add Phone Number"
                    onClick={() => arrayHelpers.push({
                      phone_number: '',
                      is_primary: '',
                      type: '',
                      notes: '',
                    })}
                  >
                    <i className="fa fa-plus ft-10 mr-2" aria-hidden="true" />
                    <span className="ft-14">Add Phone Number</span>
                  </Button>
                </div>
              )}
            />
          </Col>

          <Col lg={12} className="mt-2">
            <Label for="websites">Websites</Label>

            <FieldArray
              name="websites"
              render={arrayHelpers => (
                <div>
                  {values.websites.map((website, index) => {
                    const key = `websites.${index}`;
                    return (
                      <Row key={key}>
                        <Col lg={12}>
                          <Row>
                            <Col lg={5}>
                              <InputGroup className="mb-3">
                                <Input
                                  type="text"
                                  tag={Field}
                                  component="input"
                                  name={`${key}.website`}
                                  invalid={isInvalid(`${key}.website`, touched, errors)}
                                />
                                <InvalidErrorMessage name={`${key}.website`} />
                              </InputGroup>
                            </Col>

                            <Col lg={1}>
                              <InputGroup className="mb-3">
                                <Label check className="form-check-label ml-4">
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    tag={Field}
                                    component="input"
                                    name={`${key}.is_primary`}
                                    onChange={() => this.handlePrimaryChange('websites', index)}
                                    checked={!!values.websites[index].is_primary}
                                  />
                                  Primary
                                </Label>
                                <InvalidErrorMessage name={`${key}.is_primary`} />
                              </InputGroup>
                            </Col>

                            <Col lg={3}>
                              <InputGroup className="mb-3">
                                <InputGroup className="mb-3">
                                  <Input
                                    type="textarea"
                                    tag={Field}
                                    component="textarea"
                                    name={`${key}.notes`}
                                    placeholder="Notes..."
                                  />
                                </InputGroup>
                              </InputGroup>
                            </Col>

                            {index > 0
                            && (
                              <Col lg={1}>
                                <Button
                                  size="sm"
                                  color="danger"
                                  className="ft-white ml-2 mt-1"
                                  style={{ width: '27px', height: '25px', top: '2px' }}
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  <i className="fa fa-minus ft-10" aria-hidden="true" />
                                </Button>
                              </Col>
                            )
                            }
                          </Row>
                        </Col>
                      </Row>
                    );
                  })}
                  <Button
                    size="sm"
                    color="primary"
                    className="ft-white mb-2"
                    title="Add Website"
                    onClick={() => arrayHelpers.push({
                      website: '',
                      is_primary: '',
                      type: '',
                      notes: '',
                    })}
                  >
                    <i className="fa fa-plus ft-10 mr-2" aria-hidden="true" />
                    <span className="ft-14">Add Website</span>
                  </Button>
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

ContactInfoFormFields.propTypes = propTypes;
ContactInfoFormFields.defaultProps = defaultProps;

export default ContactInfoFormFields;
