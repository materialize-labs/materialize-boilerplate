import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import queryString from 'query-string';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Row,
} from 'reactstrap';
import { LOGIN_USER } from '../../graphql/mutations';
import LoginForm from '../../components/Forms/LoginForm';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string,
    }),
  }).isRequired,
};

const Login = (props) => {
  const { refetch, history, location } = props;
  const { redirectTo = '/dashboard' } = queryString.parse(location.search);
  return (
    <div className="app flex-row align-items-center">
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <CardGroup>
              <Card className="p-4">
                <CardBody>
                  <Mutation mutation={LOGIN_USER}>
                    {(login, { loading }) => (
                      <LoginForm
                        mutation={login}
                        refetch={refetch}
                        history={history}
                        loading={loading}
                        redirect={redirectTo}
                      />
                    )}
                  </Mutation>
                </CardBody>
              </Card>
              <Card
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: '44%' }}
              >
                <CardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Sign up with an account on Materialize Boilerplate.
                    </p>
                    <Link to="/register">
                      <Button color="primary" className="mt-3" active tabIndex={-1}>
                        Register
                        Now!
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

Login.propTypes = propTypes;

export default Login;
