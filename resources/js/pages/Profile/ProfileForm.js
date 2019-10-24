import React from 'react';
import {
  Col,
  Row,
  Button,
  Form,
  Alert,
  Input,
  InputGroup,
  Label,
} from 'reactstrap';
import * as Yup from 'yup';
import { withFormik, Field } from 'formik';
import { parseGraphqlErrors } from '../../helpers';
import {
  formikDefaultPropTypes,
  InvalidErrorMessage,
  isInvalid,
  phoneRegEx,
} from '../../helpers/forms';

const propTypes = formikDefaultPropTypes;

const defaultProps = {
  status: {},
};

const ProfileSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('First Name is required.')
    .min(2, 'First Name must be longer than 2 characters'),
  last_name: Yup.string()
    .required('Last Name is required.')
    .min(2, 'Last Name must be longer than 2 characters'),
  email: Yup.string().email().required('Email is required'),
  title: Yup.string()
    .required('Title is required.')
    .min(2, 'Title must be longer than 2 characters'),
  phone: Yup.string()
    .required('Phone number is required.')
    .matches(phoneRegEx, 'Phone number is not valid'),
});

const FormContent = (props) => {
  const {
    touched,
    errors,
    handleSubmit,
    status,
  } = props;

  return (
    <div>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            {status.errors ? (<Alert className="mt-2" color="danger">{status.errors}</Alert>) : ''}
            {status.success ? (<Alert className="mt-2" color="success">{status.success}</Alert>) : ''}
            <Row>
              <Col md="6">
                <Label for="first_name">First Name</Label>
                {' '}
                <InputGroup className="mb-3">
                  <Input
                    type="text"
                    placeholder=""
                    autoComplete="first-name"
                    tag={Field}
                    component="input"
                    name="first_name"
                    invalid={isInvalid('first_name', touched, errors)}
                  />
                  <InvalidErrorMessage name="first_name" />
                </InputGroup>
              </Col>
              <Col md="6">
                <Label for="last_name">Last Name</Label>
                {' '}
                <InputGroup className="mb-3">
                  <Input
                    type="text"
                    placeholder=""
                    autoComplete="last-name"
                    tag={Field}
                    component="input"
                    name="last_name"
                    invalid={isInvalid('last_name', touched, errors)}
                  />
                  <InvalidErrorMessage name="last_name" />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <Label for="email">Email</Label>
                {' '}
                <InputGroup className="mb-3">
                  <Input
                    type="text"
                    placeholder=""
                    autoComplete="email"
                    tag={Field}
                    component="input"
                    name="email"
                    invalid={isInvalid('email', touched, errors)}
                  />
                  <InvalidErrorMessage name="email" />
                </InputGroup>
              </Col>
              <Col md="6">
                <Label for="title">Title</Label>
                {' '}
                <InputGroup className="mb-3">
                  <Input
                    type="text"
                    placeholder=""
                    autoComplete="title"
                    tag={Field}
                    component="input"
                    name="title"
                    invalid={isInvalid('title', touched, errors)}
                  />
                  <InvalidErrorMessage name="title" />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <Label for="phone">Phone</Label>
                {' '}
                <InputGroup className="mb-3">
                  <Input
                    type="text"
                    placeholder=""
                    autoComplete="phone"
                    tag={Field}
                    component="input"
                    name="phone"
                    invalid={isInvalid('phone', touched, errors)}
                  />
                  <InvalidErrorMessage name="phone" />
                </InputGroup>
              </Col>
              <Col md="6" />
            </Row>

            <div style={{ float: 'right' }}>
              <Button
                color="success"
                type="submit"
                style={{ minWidth: '200px' }}
                disabled={Object.keys(errors).length > 0}
              >
                Submit
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

FormContent.propTypes = propTypes;
FormContent.defaultProps = defaultProps;

const ProfileForm = withFormik({
  mapPropsToValues: (props) => {
    const { session } = props;
    return {
      id: session.me.id,
      first_name: session.me.first_name,
      last_name: session.me.last_name,
      email: session.me.email,
      title: session.me.title,
      phone: session.me.phone,
    };
  },

  handleSubmit: (values, {
    setSubmitting,
    setFieldError,
    setStatus,
    props: {
      mutation,
    },
  }) => {
    setStatus({ errors: null });

    mutation({ variables: values }).then(async () => {
      setSubmitting(false);
      setStatus({ errors: null, success: 'Profile updated.' });
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

  validationSchema: ProfileSchema,

  displayName: 'ProfileForm',
})(FormContent);

export default ProfileForm;
