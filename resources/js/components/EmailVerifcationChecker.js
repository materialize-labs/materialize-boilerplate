import React, { Component } from 'react';
import {
  ApolloConsumer,
  Mutation,
} from 'react-apollo';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import {
  logout,
  parseGraphqlErrors,
} from '../helpers';
import { RESEND_VERIFICATION_EMAIL } from '../graphql/mutations';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  expires: PropTypes.string.isRequired,
  signature: PropTypes.string.isRequired,
  mutation: PropTypes.func.isRequired,
};

class EmailVerifcationChecker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      resent: false,
    };
  }

  componentWillMount() {
    const {
      mutation,
      id,
      expires,
      signature,
      history,
    } = this.props;
    mutation({ variables: { id, expires, signature } }).then(({ data }) => {
      const { status } = data.verifyEmail;
      if (['EMAIL_ALREADY_VERIFIED', 'EMAIL_VERIFIED'].includes(status)) {
        history.push('/dashboard');
      }
    }).catch((error) => {
      if (error.graphQLErrors) {
        const { serverErrors } = parseGraphqlErrors(error);
        if (serverErrors.length > 0) {
          this.setState({ error: serverErrors[0] });
        }
      }
    });
  }

  renderErrorMessage(error) {
    const { history, location } = this.props;
    let bodyText;
    let child;

    const { pathname, search } = location;
    const path = queryString.stringify({ redirectTo: `${pathname}${search}` });

    if (error.category === 'AuthError') {
      bodyText = error.message;
      child = (
        <ApolloConsumer>
          {client => (
            <Button
              color="link"
              className="p-0 alert-link align-baseline"
              onClick={() => logout(client, history, path)}
            >
              Click here to login as a different user.
            </Button>
          )}
        </ApolloConsumer>
      );
    }

    if (error.category === 'InvalidLink') {
      bodyText = error.message;
      child = (
        <Mutation mutation={RESEND_VERIFICATION_EMAIL}>
          {resend => (
            <Button
              color="link"
              className="p-0 alert-link align-baseline"
              onClick={() => {
                resend().then(() => {
                  this.setState({ error: null, resent: true });
                });
              }}
            >
              Click here to resend the email.
            </Button>
          )}
        </Mutation>
      );
    }
    return (
      <span>
        <strong>Error: </strong>
        {bodyText}
        &nbsp;
        {child}
      </span>
    );
  }

  render() {
    const { error, resent } = this.state;
    if (error) {
      return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <Alert color="warning">
                  {this.renderErrorMessage(error)}
                </Alert>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    if (resent) {
      return (
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
              <Col md="8">
                <Alert color="success">
                  <strong>Email has been resent!</strong>
                  &nbsp;Check your email for a new verification link!
                </Alert>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }
    return (<div />);
  }
}

EmailVerifcationChecker.propTypes = propTypes;

export default EmailVerifcationChecker;
