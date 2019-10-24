import React, { Component } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
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
  setFieldValue: PropTypes.func.isRequired,
  formFields: PropTypes.shape({
    contact_types: PropTypes.shape({
      addresses: PropTypes.arrayOf(PropTypes.shape()),
    }),
    states: PropTypes.arrayOf(PropTypes.shape()),
  }),
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
};

const defaultProps = {
  formFields: {},
};

class AddressFormFields extends Component {
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
      setFieldValue,
      values,
      formFields,
      touched,
      errors,
    } = this.props;


    const { addresses: addressTypes } = formFields.contact_types;

    return (
      <div>
        <Row>
          <Col xs={12}>
            <FieldArray
              name="addresses"
              render={arrayHelpers => (
                <div>
                  {values.addresses.map((address, index) => {
                    const key = `addresses.${index}`;
                    return (
                      <div key={key}>
                        <Row>
                          <Col>
                            <strong>
                              Address&nbsp;
                              {index + 1}
                            </strong>
                          </Col>
                          {index > 0
                          && (
                            <Col className="ml-auto col-auto">
                              <Button
                                size="sm"
                                color="danger"
                                className="ft-white mt-1"
                                style={{ width: '27px', height: '25px', top: '2px' }}
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <i className="fa fa-minus ft-10" aria-hidden="true" />
                              </Button>
                            </Col>
                          )}
                        </Row>
                        <Row>
                          <Col>
                            <Label>Street</Label>
                            <InputGroup className="mb-3">
                              <Input
                                type="textarea"
                                tag={Field}
                                component="textarea"
                                name={`${key}.street`}
                                invalid={isInvalid(`${key}.street`, touched, errors)}
                              />
                              <InvalidErrorMessage name={`${key}.street`} />
                            </InputGroup>
                          </Col>
                        </Row>
                        <Row>

                          <Col lg={4}>
                            <Label>City</Label>
                            <InputGroup className="mb-3">
                              <Input
                                type="text"
                                tag={Field}
                                component="input"
                                name={`${key}.city`}
                                invalid={isInvalid(`${key}.city`, touched, errors)}
                              />
                              <InvalidErrorMessage name={`${key}.city`} />
                            </InputGroup>
                          </Col>

                          <Col lg={4}>
                            <Label for="state">State</Label>
                            <InputGroup className="mb-3">
                              <div style={{ width: '100%' }}>
                                <Select
                                  id="state"
                                  value={address.state}
                                  onChange={option => setFieldValue(`${key}.state`, option)}
                                  options={formFields.states}
                                  isClearable
                                  name={`${key}.state`}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                  }}
                                  className={(isInvalid(`${key}.state`, touched, errors)) ? 'is-invalid' : ''}
                                />
                                <InvalidErrorMessage name={`${key}.state`} />
                              </div>
                            </InputGroup>
                          </Col>

                          <Col lg={4}>
                            <Label>Postal Code</Label>
                            <InputGroup className="mb-3">
                              <Input
                                type="text"
                                tag={Field}
                                component="input"
                                name={`${key}.post_code`}
                                invalid={isInvalid(`${key}.post_code`, touched, errors)}
                              />
                              <InvalidErrorMessage name={`${key}.post_code`} />
                            </InputGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col lg={4}>
                            <InputGroup className="mb-3">
                              <Label check className="form-check-label ml-4">
                                <Input
                                  className="form-check-input"
                                  type="radio"
                                  tag={Field}
                                  component="input"
                                  name={`${key}.is_primary`}
                                  onChange={() => this.handlePrimaryChange('addresses', index)}
                                  checked={!!values.addresses[index].is_primary}
                                />
                                Primary
                              </Label>
                              <InvalidErrorMessage name={`${key}.is_primary`} />
                            </InputGroup>
                          </Col>

                          <Col xs={8}>
                            <InputGroup className="mb-3">
                              <div style={{ width: '100%' }}>
                                <Select
                                  id="type"
                                  value={values.addresses[index].type}
                                  onChange={option => setFieldValue(`${key}.type`, option)}
                                  options={addressTypes}
                                  isClearable
                                  name={`${key}.type`}
                                  placeholder="Type..."
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                  }}
                                />
                              </div>
                            </InputGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col xs={12}>
                            <InputGroup className="mb-3">
                              <InputGroup className="mb-3">
                                <Input
                                  type="textarea"
                                  tag={Field}
                                  component="textarea"
                                  name={`${key}.notes`}
                                  placeholder="Notes..."
                                  invalid={isInvalid(`${key}.notes`, touched, errors)}
                                />
                                <InvalidErrorMessage name={`${key}.notes`} />
                              </InputGroup>
                            </InputGroup>
                          </Col>
                        </Row>

                      </div>
                    );
                  })}

                  <Button
                    size="sm"
                    color="primary"
                    className="ft-white"
                    title="Add Address"
                    onClick={() => arrayHelpers.push({
                      street: '',
                      city: '',
                      state: '',
                      post_code: '',
                      is_primary: '',
                      type: '',
                      notes: '',
                      country_id: '',
                    })}
                  >
                    <i className="fa fa-plus ft-10 mr-2" aria-hidden="true" />
                    <span className="ft-14">Add Address</span>
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

AddressFormFields.propTypes = propTypes;
AddressFormFields.defaultProps = defaultProps;

export default AddressFormFields;
