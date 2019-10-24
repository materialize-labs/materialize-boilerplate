import React, { Component, Suspense } from 'react';
import { ApolloConsumer } from 'react-apollo';
import { Container } from 'reactstrap';
import PropTypes from 'prop-types';

import {
  AppFooter,
  AppHeader,
} from '@coreui/react';

// routes config
// import routes from '../../routes';
import { logout } from '../../helpers';

const Footer = React.lazy(() => import('./Footer'));
const Header = React.lazy(() => import('./Header'));

const propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
    }),
  }),
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  session: {},
};

class AuthenticatedLayout extends Component {
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

  signOut(e, client) {
    e.preventDefault();
    const { history } = this.props;
    logout(client, history);
  }

  render() {
    const { children, session } = this.props;
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <ApolloConsumer>
              {client => (<Header session={session} onLogout={e => this.signOut(e, client)} />)}
            </ApolloConsumer>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <main className="main">
            <Container fluid>
              <Suspense fallback={this.loading()}>
                { children }
              </Suspense>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <Footer />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

AuthenticatedLayout.propTypes = propTypes;
AuthenticatedLayout.defaultProps = defaultProps;

export default AuthenticatedLayout;
