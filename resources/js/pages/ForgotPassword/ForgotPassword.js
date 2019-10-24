import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Row,
} from 'reactstrap';
import { FORGOT_PASSWORD } from '../../graphql/mutations';
import ForgotPasswordForm from '../../components/Forms/ForgotPasswordForm';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
};

const ForgotPassword = (props) => {
  const { refetch, history } = props;
  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <Card className="mx-4">
              <CardBody className="p-4">
                <Mutation mutation={FORGOT_PASSWORD}>
                  {(forgotPassword, { loading }) => (
                    <div>
                      <ForgotPasswordForm
                        mutation={forgotPassword}
                        refetch={refetch}
                        history={history}
                        loading={loading}
                      />
                    </div>
                  )}
                </Mutation>
              </CardBody>
              <CardFooter className="p-4">
                <Row>
                  <Col xs="6">
                    <Link to="/register">
                      <Button color="link" className="px-0" type="button">New User? Sign up here!</Button>
                    </Link>
                  </Col>
                  <Col className="text-right">
                    <Link to="/login">
                      <Button color="link" className="px-0" type="button">Login</Button>
                    </Link>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

ForgotPassword.propTypes = propTypes;

export default ForgotPassword;
