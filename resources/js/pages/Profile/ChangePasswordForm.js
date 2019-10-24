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
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import * as Yup from 'yup';
import { withFormik, Field } from 'formik';
import { parseGraphqlErrors } from '../../helpers';
import {
  formikDefaultPropTypes,
  InvalidErrorMessage,
  isInvalid,
} from '../../helpers/forms';

const propTypes = formikDefaultPropTypes;

const defaultProps = {
  status: {},
};

const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password confirm is required'),
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
            <ModalBody>
              {status.errors ? (<Alert className="mt-2" color="danger">{status.errors}</Alert>) : ''}
              {status.success ? (<Alert className="mt-2" color="success">{status.success}</Alert>) : ''}
              <Row>
                <Col>
                  <Label for="password">Password</Label>
                  {' '}
                  <InputGroup className="mb-3">
                    <Input
                      type="password"
                      placeholder=""
                      autoComplete="password"
                      tag={Field}
                      component="input"
                      name="password"
                      invalid={isInvalid('password', touched, errors)}
                    />
                    <InvalidErrorMessage name="password" />
                  </InputGroup>
                </Col>
                <Col>
                  <Label for="last_name">Confirm Password</Label>
                  {' '}
                  <InputGroup className="mb-3">
                    <Input
                      type="password"
                      placeholder=""
                      autoComplete="new-password"
                      tag={Field}
                      component="input"
                      name="passwordConfirm"
                      invalid={isInvalid('passwordConfirm', touched, errors)}
                    />
                    <InvalidErrorMessage name="passwordConfirm" />
                  </InputGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button
                color="success"
                type="submit"
                style={{ minWidth: '200px' }}
                disabled={Object.keys(errors).length > 0}
              >
                Submit
              </Button>
            </ModalFooter>
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
    const { user } = props;
    return {
      id: user.id,
      password: '',
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
      setStatus({ errors: null, success: 'Password updated.' });
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

  validationSchema: ChangePasswordSchema,

  displayName: 'ProfileForm',
})(FormContent);

export default ProfileForm;
