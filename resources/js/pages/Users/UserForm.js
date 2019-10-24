import React from 'react';
import {
  Col,
  Row,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  Alert,
  Input,
  InputGroup,
  Label,
} from 'reactstrap';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { withFormik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { parseGraphqlErrors } from '../../helpers';
import {
  InvalidErrorMessage,
  isInvalid,
} from '../../helpers/forms';


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
  handleSubmit: PropTypes.func.isRequired,
  status: PropTypes.shape({
    errors: PropTypes.string,
  }),
  setFieldValue: PropTypes.func.isRequired,
  closeModal: PropTypes.func,
  type: PropTypes.string,
};

const defaultProps = {
  closeModal: () => { },
  status: {},
  type: '',
};

const UserSchema = Yup.object().shape({
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
  password: Yup.string().required('Password is required'),
  role: Yup.object().shape({
    label: Yup.string().required('Role is required.'),
  }),
});

const FormContent = (props) => {
  const {
    touched,
    errors,
    handleSubmit,
    status,
    type,
    setFieldValue,
    values,
  } = props;

  const options = [
    { value: 'owner', label: 'Owner' },
    { value: 'manager', label: 'Manager' },
    { value: 'user', label: 'User' },
  ];

  return (
    <div>
      <Row>
        <Col>
          <ModalHeader toggle={props.closeModal}>
            {type}
            {' '}
            User
          </ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              {status.errors ? (<Alert color="danger">{status.errors}</Alert>) : ''}
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
              <Label for="password">Password</Label>
              {' '}
              <InputGroup className="mb-3">
                <Input
                  type="text"
                  placeholder=""
                  autoComplete="password"
                  tag={Field}
                  component="input"
                  name="password"
                  invalid={isInvalid('password', touched, errors)}
                />
                <InvalidErrorMessage name="password" />
              </InputGroup>
              <Label for="role">Role</Label>
              <InputGroup className="mb-3">
                <div style={{ width: '100%' }}>
                  <Select
                    id="role"
                    value={values.role}
                    onChange={option => setFieldValue('role', option)}
                    options={options}
                    placeholder="Role"
                    isClearable
                    invalid={isInvalid('role', touched, errors)}
                  />
                  <ErrorMessage name="role">
                    {roleErrors => (
                      <div
                        className="invalid-feedback"
                        style={{ display: 'block' }}
                      >
                        {roleErrors.label}
                      </div>
                    )}
                  </ErrorMessage>
                </div>
              </InputGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={props.closeModal}>Cancel</Button>
              <Button
                color="success"
                type="submit"
                style={{ minWidth: '200px' }}
                disabled={Object.keys(errors).length > 0}
              >
                Submit
              </Button>
              {' '}
            </ModalFooter>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

FormContent.propTypes = propTypes;
FormContent.defaultProps = defaultProps;

const UserForm = withFormik({
  mapPropsToValues: () => ({
    first_name: '',
    last_name: '',
    email: '',
    title: '',
    password: '',
    role: '',
    organization: '',
  }),

  handleSubmit: (values, {
    setSubmitting,
    setFieldError,
    setStatus,
    props: {
      mutation, closeModal, refetch, session,
    },
  }) => {
    setStatus({ errors: null });

    const variables = values;
    variables.role = values.role.value;
    variables.organization = session.me.organization.id;

    mutation({ variables }).then(async () => {
      setSubmitting(false);
      closeModal();
      await (refetch());
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

  validationSchema: UserSchema,

  displayName: 'UserForm',
})(FormContent);

export default UserForm;
