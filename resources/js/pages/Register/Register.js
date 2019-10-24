import React from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Row,
} from 'reactstrap';
import RegistrationForm from '../../components/Forms/RegistrationForm';
import { REGISTER_USER } from '../../graphql/mutations';

const propTypes = {
  refetch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const Register = (props) => {
  const { refetch, history } = props;
  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="6">
            <Card className="mx-4">
              <CardBody className="p-4">
                <Mutation mutation={REGISTER_USER} errorPolicy="all">
                  {(newUser, { loading }) => (
                    <div>
                      <RegistrationForm
                        mutation={newUser}
                        refetch={refetch}
                        history={history}
                        loading={loading}
                      />
                      <div className="text-center mt-2">
                        <Link to="/login">
                          <Button color="link" className="px-0">Already have an account? Login here!</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </Mutation>
              </CardBody>
              <CardFooter className="p-4">
                <Row>
                  <Col className="text-center">
                    <Button
                      href="/redirect/google"
                      className="btn btn-secondary btn-google"
                    >
                      <span className="fa fa-google mr-2" />
                      Sign up with Google
                    </Button>
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

Register.propTypes = propTypes;

export default Register;
