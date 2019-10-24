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
import { parseGraphqlErrors } from '../../helpers';
import {
  formikDefaultPropTypes,
  InvalidErrorMessage,
  isInvalid,
} from '../../helpers/forms';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
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

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Forgot your password?</h1>
      <p className="text-muted">Enter your email below and we will send you a link to reset your password.</p>
      {status.success ? (<Alert color="success">{status.success}</Alert>) : ''}
      {status.errors ? (<Alert color="danger">{status.errors}</Alert>) : ''}
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          tag={Field}
          component="input"
          name="email"
          invalid={isInvalid('email', touched, errors)}
        />
        <InvalidErrorMessage name="email" />
      </InputGroup>
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

const ForgotPasswordForm = withFormik({
  mapPropsToValues: () => ({
    email: '',
  }),

  handleSubmit: (values, {
    setSubmitting,
    setFieldError,
    setStatus,
    props: { mutation },
  }) => {
    setStatus({ errors: null });
    mutation({ variables: values }).then(async ({ data }) => {
      const { message, status } = data.forgotPassword;
      const newState = {};
      const key = status === 'EMAIL_SENT' ? 'success' : 'errors';
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

  validationSchema: ForgotPasswordSchema,

  displayName: 'ForgotPasswordForm',
})(FormContent);

export default ForgotPasswordForm;
