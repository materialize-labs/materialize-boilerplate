import React from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { withFormik, Field } from 'formik';
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';
import * as Cookies from 'es-cookie';
import { parseGraphqlErrors } from '../../helpers';
import {
  formikDefaultPropTypes,
  InvalidErrorMessage,
  isInvalid,
} from '../../helpers/forms';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().required('Password is required'),
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
      <h1>Login</h1>
      <p className="text-muted">Sign In to your account</p>
      {status.errors ? (<Alert color="danger">{status.errors}</Alert>) : ''}
      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText>
            <i className="icon-user" />
          </InputGroupText>
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
      <InputGroup className="mb-4">
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
      <Row>
        <Col xs="6">
          <Button
            color="primary"
            className="px-4"
            disabled={loading || Object.keys(errors).length > 0}
            type="submit"
          >
            Login
          </Button>
        </Col>
        <Col xs="6" className="text-right">
          <Button
            href="/redirect/google"
            className="btn btn-secondary btn-google"
          >
            <span className="fa fa-google mr-2" />
            Sign in
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs="6" className="d-lg-none">
          <Link to="/register">
            <Button color="link" className="px-0" type="button">New User? Sign up here!</Button>
          </Link>
        </Col>
        <Col className="text-right">
          <Link to="/forgot-password">
            <Button color="link" className="px-0" type="button">Forgot password?</Button>
          </Link>
        </Col>
      </Row>
    </Form>
  );
};

FormContent.propTypes = propTypes;
FormContent.defaultProps = defaultProps;

const LoginForm = withFormik({
  mapPropsToValues: () => ({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
  }),

  handleSubmit: (values, {
    setSubmitting,
    setFieldError,
    setStatus,
    props: {
      mutation,
      refetch,
      history,
      redirect,
    },
  }) => {
    setStatus({ errors: null });
    mutation({ variables: values }).then(async ({ data }) => {
      setSubmitting(false);
      Cookies.set('token', data.login.access_token);
      await refetch();
      history.push(redirect);
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

  validationSchema: LoginSchema,

  displayName: 'LoginForm',
})(FormContent);

export default LoginForm;
