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
import * as Cookies from 'es-cookie';
import * as Yup from 'yup';
import { parseGraphqlErrors } from '../../helpers';
import {
  formikDefaultPropTypes,
  InvalidErrorMessage,
  isInvalid,
} from '../../helpers/forms';

const RegistrationSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('First Name is required.')
    .min(2, 'First Name must be longer than 2 characters'),
  last_name: Yup.string()
    .required('Last Name is required.')
    .min(2, 'Last Name must be longer than 2 characters'),
  organization: Yup.string()
    .required('Organization is required.')
    .min(2, 'Organization must be longer than 2 characters'),
  password: Yup.string().required('Password is required'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password confirm is required'),
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
      <h1>Register</h1>
      <p className="text-muted">Create your account</p>
      {status.errors ? (<Alert color="danger">{status.errors}</Alert>) : ''}
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="icon-user" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          placeholder="First Name"
          autoComplete="first-name"
          tag={Field}
          component="input"
          name="first_name"
          invalid={isInvalid('first_name', touched, errors)}
        />
        <InvalidErrorMessage name="first_name" />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="icon-user" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          placeholder="Last Name"
          autoComplete="last-name"
          tag={Field}
          component="input"
          name="last_name"
          invalid={isInvalid('last_name', touched, errors)}
        />
        <InvalidErrorMessage name="last_name" />
      </InputGroup>
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
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="fa fa-building-o" />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          placeholder="Organization"
          autoComplete="organization"
          tag={Field}
          component="input"
          name="organization"
          invalid={isInvalid('organization', touched, errors)}
        />
        <InvalidErrorMessage name="organization" />
      </InputGroup>
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
          name="passwordConfirm"
          invalid={isInvalid('passwordConfirm', touched, errors)}
        />
        <InvalidErrorMessage name="passwordConfirm" />
      </InputGroup>
      <Button
        color="success"
        block
        type="submit"
        disabled={loading || Object.keys(errors).length > 0}
      >
        Create Account
      </Button>
    </Form>
  );
};

FormContent.propTypes = propTypes;
FormContent.defaultProps = defaultProps;

const RegistrationForm = withFormik({
  mapPropsToValues: () => ({
    first_name: '',
    last_name: '',
    email: '',
    organization: '',
    password: '',
    passwordConfirm: '',
  }),

  handleSubmit: (values, {
    setSubmitting,
    setFieldError,
    setStatus,
    props: { mutation, refetch, history },
  }) => {
    setStatus({ errors: null });
    mutation({ variables: values }).then(async ({ data }) => {
      setSubmitting(false);
      Cookies.set('token', data.newUser.access_token);
      await refetch();
      history.push('/dashboard');
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

  validationSchema: RegistrationSchema,

  displayName: 'RegistrationForm',
})(FormContent);

export default RegistrationForm;
