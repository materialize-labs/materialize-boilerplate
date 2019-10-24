import React from 'react';
import { ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import _ from 'lodash';

export const InvalidErrorMessage = props => (
  <ErrorMessage {...props} render={msg => <div className="invalid-feedback">{msg}</div>} />
);

export const isInvalid = (name, touched, errors) => !!(
  _.get(touched, name, false) && _.get(errors, name, false)
);

export const phoneRegEx = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

export const formikDefaultPropTypes = {
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
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  status: PropTypes.shape({
    errors: PropTypes.string,
  }),
};
