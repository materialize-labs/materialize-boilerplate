import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import queryString from 'query-string';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Row,
} from 'reactstrap';
import { UPDATE_FORGOTTEN_PASSWORD } from '../../graphql/mutations';
import ResetPasswordForm from '../../components/Forms/ResetPasswordForm';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  refetch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      token: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
};

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      email: null,
    };
  }

  componentDidMount() {
    const { match, location, history } = this.props;
    const values = queryString.parse(location.search);
    if (!values.email) {
      history.push('/login');
    }
    this.setState({ token: match.params.token, email: values.email });
  }

  render() {
    const { refetch, history } = this.props;
    const { token, email } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Mutation mutation={UPDATE_FORGOTTEN_PASSWORD}>
                    {(forgotPassword, { loading }) => (
                      <div>
                        {(!!token && !!email) && (
                          <ResetPasswordForm
                            mutation={forgotPassword}
                            refetch={refetch}
                            history={history}
                            loading={loading}
                            token={token}
                            email={email}
                          />
                        )}
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
  }
}

ResetPassword.propTypes = propTypes;

export default ResetPassword;
