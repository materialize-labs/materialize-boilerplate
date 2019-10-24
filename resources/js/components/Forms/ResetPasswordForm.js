import React from 'react';
import { withFormik, Field } from 'formik';
import {
  Alert,
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { parseGraphqlErrors } from '../../helpers';
import {
  formikDefaultPropTypes,
  InvalidErrorMessage,
  isInvalid,
} from '../../helpers/forms';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password confirm is required'),
});

const propTypes = formikDefaultPropTypes;

const defaultProps = {
  status: {},
};

const FormContent = (props) => {
  const {
    touched,
    errors,
    handleSubmit,
    status,
    loading,
  } = props;

  if (status.success) {
    return (
      <div>
        <h1>Reset Password?</h1>
        {status.success ? (<Alert color="success">{status.success}</Alert>) : ''}
        <Link to="/login">
          <Button color="primary">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Reset Password?</h1>
      <p className="text-muted">Choose a new password.</p>
      {status.success ? (<Alert color="success">{status.success}</Alert>) : ''}
      {status.errors ? (<Alert color="danger">{status.errors}</Alert>) : ''}
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="icon-lock" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          tag={Field}
          component="input"
          name="password"
          invalid={isInvalid('password', touched, errors)}
        />
        <InvalidErrorMessage name="password" />
      </InputGroup>
      <InputGroup className="mb-4">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="icon-lock" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          tag={Field}
          component="input"
          name="passwordConfirmation"
          invalid={isInvalid('passwordConfirmation', touched, errors)}
        />
        <InvalidErrorMessage name="passwordConfirmation" />
      </InputGroup>
      <Input
        type="hidden"
        tag={Field}
        component="input"
        name="email"
      />
      <Input
        type="hidden"
        tag={Field}
        component="input"
        name="token"
      />
      <Button
        color="success"
        block
        type="submit"
        disabled={loading || Object.keys(errors).length > 0}
      >
        Send
      </Button>
    </Form>
  );
};

FormContent.propTypes = propTypes;
FormContent.defaultProps = defaultProps;

const ResetPasswordForm = withFormik({
  mapPropsToValues: ({ token, email }) => ({
    token,
    email,
    password: '',
    passwordConfirmation: '',
  }),

  handleSubmit: (values, {
    setSubmitting,
    setFieldError,
    setStatus,
    props: { mutation },
  }) => {
    setStatus({ errors: null });
    mutation({ variables: values }).then(async ({ data }) => {
      const { message, status } = data.updateForgottenPassword;
      const newState = {};
      const key = status === 'PASSWORD_UPDATED' ? 'success' : 'errors';
      newState[key] = message;
      setStatus(newState);
    })
      .catch((error) => {
        if (error.graphQLErrors) {
          const { serverErrors, validationErrors } = parseGraphqlErrors(error);
          validationErrors.forEach(err => setFieldError(err.field, err.message));
          if (serverErrors.length > 0) {
            setStatus({ errors: serverErrors.map(err => err.message).join('<br>') });
          }
        }

        setSubmitting(false);
      });
  },

  validationSchema: ResetPasswordSchema,

  displayName: 'ResetPasswordForm',
})(FormContent);

export default ResetPasswordForm;
