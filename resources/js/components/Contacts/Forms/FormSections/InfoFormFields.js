import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import {
  Col,
  Input,
  InputGroup,
  Label,
  Row,
  FormGroup,
} from 'reactstrap';
import {
  ErrorMessage,
  Field,
} from 'formik';
import DatePicker from 'react-datepicker/es';
import {
  InvalidErrorMessage,
  isInvalid,
} from '../../../../helpers/forms';

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
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  formFields: PropTypes.shape({
    marital_statuses: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

const defaultProps = {
  formFields: {},
};

const InfoFormFields = (props) => {
  const {
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    values,
    formFields,
  } = props;

  return (
    <div>
      <Row className="align-items-center">
        <Col sm={6} lg={3}>
          <Label for="sex">Sex</Label>
          <InputGroup className="mb-3">
            <Input
              type="text"
              autoComplete="sex"
              tag={Field}
              component="input"
              name="sex"
              invalid={isInvalid('sex', touched, errors)}
            />
            <InvalidErrorMessage name="sex" />
          </InputGroup>
        </Col>
        <Col sm={6} lg={4}>
          <Label for="language">Language</Label>
          <InputGroup className="mb-3">
            <Input
              type="text"
              autoComplete="language"
              tag={Field}
              component="input"
              name="language"
              invalid={isInvalid('language', touched, errors)}
            />
            <InvalidErrorMessage name="language" />
          </InputGroup>
        </Col>
        <Col xs={6} lg={3}>
          <Label for="dob">DOB</Label>
          <InputGroup className="mb-3">
            <DatePicker
              selected={values.dob || null}
              onChange={value => setFieldValue('dob', value)}
              onChangeRaw={(e) => {
                const date = moment(e.target.value, 'MM/DD/YYYY');
                if (date.isValid()) {
                  setFieldValue('dob', date);
                }
              }}
              onBlur={() => setFieldTouched('dob', true)}
              name="dob"
              autoComplete="off"
              placeholderText="MM/DD/YYYY"
              disabledKeyboardNavigation
              className="form-control"
              showYearDropdown
              showMonthDropdown
            />
            <InvalidErrorMessage name="dob" />
          </InputGroup>
        </Col>
        <Col xs={6} lg={2}>
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
      <Row>
        <Col sm={6} lg={4}>
          <Label for="ssn">SSN</Label>
          <InputGroup className="mb-3">
            <Input
              type="text"
              autoComplete="ssn"
              tag={Field}
              component="input"
              name="ssn"
              invalid={isInvalid('ssn', touched, errors)}
            />
            <InvalidErrorMessage name="ssn" />
          </InputGroup>
        </Col>
        <Col sm={6} lg={4}>
          <Label for="marital_status">Marital Status</Label>
          <InputGroup className="mb-3">
            <div style={{ width: '100%' }}>
              <Select
                id="marital_status"
                value={values.marital_status}
                onChange={option => setFieldValue('marital_status', option)}
                options={formFields.marital_statuses}
                invalid={isInvalid('marital_status', touched, errors)}
                isClearable
              />
              <ErrorMessage name="type">
                {maritalStatusErrors => (
                  <div
                    className="invalid-feedback"
                    style={{ display: 'block' }}
                  >
                    {maritalStatusErrors.label}
                  </div>
                )}
              </ErrorMessage>
            </div>
          </InputGroup>
        </Col>
        <Col sm={6} lg={4}>
          <Label for="spouse">Spouse</Label>
          <InputGroup className="mb-3">
            <Input
              type="text"
              autoComplete="spouse"
              tag={Field}
              component="input"
              name="spouse"
              invalid={isInvalid('spouse', touched, errors)}
            />
            <InvalidErrorMessage name="spouse" />
          </InputGroup>
        </Col>
      </Row>
    </div>
  );
};

InfoFormFields.propTypes = propTypes;
InfoFormFields.defaultProps = defaultProps;

export default InfoFormFields;
