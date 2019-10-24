import React, { Component } from 'react';
import queryString from 'query-string';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { VERIFY_USER_EMAIL } from '../../graphql/mutations';
import EmailVerifcationChecker from '../../components/EmailVerifcationChecker';

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
    }),
  }),
};

const defaultProps = {
  session: {},
};

class VerifyEmail extends Component {
  componentWillMount() {
    const { history, session, location } = this.props;
    if (!(session && session.me)) {
      const { pathname, search } = location;
      const path = queryString.stringify({ redirectTo: `${pathname}${search}` });
      history.push(`/login?${path}`);
    }
  }

  render() {
    const { match, location, history } = this.props;
    const { id } = match.params;
    const { search } = location;
    const { expires, signature } = queryString.parse(search);

    return (
      <Mutation mutation={VERIFY_USER_EMAIL}>
        {verifyEmail => (
          <EmailVerifcationChecker
            mutation={verifyEmail}
            id={id}
            expires={expires}
            signature={signature}
            history={history}
            location={location}
          />
        )}
      </Mutation>
    );
  }
}

VerifyEmail.propTypes = propTypes;
VerifyEmail.defaultProps = defaultProps;

export default VerifyEmail;
