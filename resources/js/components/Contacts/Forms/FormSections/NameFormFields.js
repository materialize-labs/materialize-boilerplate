import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import {
  Input,
  InputGroup,
  Label,
} from 'reactstrap';
import {
  ErrorMessage,
  Field,
} from 'formik';
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
  formFields: PropTypes.shape({
    salutations: PropTypes.arrayOf(PropTypes.shape()),
  }),
};

const defaultProps = {
  formFields: {},
};

const NameFormFields = (props) => {
  const {
    touched,
    errors,
    setFieldValue,
    values,
    formFields,
  } = props;

  return (
    <div>
      <Label for="salutation">Salutation</Label>
      <InputGroup className="mb-3">
        <div style={{ width: '100%' }}>
          <Select
            id="salutation"
            value={values.salutation}
            onChange={option => setFieldValue('salutation', option)}
            options={formFields.salutations}
            invalid={isInvalid('salutation', touched, errors)}
            isClearable
          />
          <ErrorMessage name="type">
            {salutationErrors => (
              <div
                className="invalid-feedback"
                style={{ display: 'block' }}
              >
                {salutationErrors.label}
              </div>
            )}
          </ErrorMessage>
        </div>
      </InputGroup>

      <Label for="first_name">&#42;First Name</Label>
      <InputGroup className="mb-3">
        <Input
          type="text"
          autoComplete="first-name"
          tag={Field}
          component="input"
          name="first_name"
          invalid={isInvalid('first_name', touched, errors)}
        />
        <InvalidErrorMessage name="first_name" />
      </InputGroup>

      <Label for="middle_name">Middle Name</Label>
      <InputGroup className="mb-3">
        <Input
          type="text"
          autoComplete="middle-name"
          tag={Field}
          component="input"
          name="middle_name"
          invalid={isInvalid('middle_name', touched, errors)}
        />
        <InvalidErrorMessage name="middle_name" />
      </InputGroup>

      <Label for="last_name">&#42;Last Name</Label>
      <InputGroup className="mb-3">
        <Input
          type="text"
          autoComplete="last-name"
          tag={Field}
          component="input"
          name="last_name"
          invalid={isInvalid('last_name', touched, errors)}
        />
        <InvalidErrorMessage name="last_name" />
      </InputGroup>

      <Label for="suffix">Suffix</Label>
      <InputGroup className="mb-3">
        <Input
          type="text"
          tag={Field}
          component="input"
          name="suffix"
          invalid={isInvalid('suffix', touched, errors)}
        />
        <InvalidErrorMessage name="suffix" />
      </InputGroup>

      <Label for="nickname">Nickname</Label>
      <InputGroup className="mb-3">
        <Input
          type="text"
          tag={Field}
          component="input"
          name="nickname"
          invalid={isInvalid('nickname', touched, errors)}
        />
        <InvalidErrorMessage name="nickname" />
      </InputGroup>
    </div>
  );
};

NameFormFields.propTypes = propTypes;
NameFormFields.defaultProps = defaultProps;

export default NameFormFields;
