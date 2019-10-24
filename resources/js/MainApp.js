import React from 'react';
import PropTypes from 'prop-types';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import './MainApp.scss';
import withSession from './hocs/withSession';
import routes from './routes';
import withAuth from './hocs/withAuth';
import { sessionCheck } from './helpers';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const AuthenticatedLayout = withAuth(sessionCheck)(React.lazy(
  () => import('./containers/AuthenticatedLayout'),
));

// Pages
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Page500 = React.lazy(() => import('./pages/Page500'));
const NotFound = React.lazy(() => import('./pages/Page404/Page404'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail/VerifyEmail'));

const propTypes = {
  refetch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    me: PropTypes.shape({
      email: PropTypes.string,
    }),
  }),
};

const defaultProps = {
  session: {},
};

const MainApp = ({ refetch, session }) => (
  <BrowserRouter>
    <React.Suspense fallback={loading()}>
      <Switch>
        <Route
          exact
          path="/login"
          name="Login Page"
          render={props => <Login {...props} refetch={refetch} />}
        />
        <Route
          exact
          path="/register"
          name="Register Page"
          render={props => <Register {...props} refetch={refetch} />}
        />
        <Route
          exact
          path="/forgot-password"
          name="Forgot Password Page"
          render={props => <ForgotPassword {...props} refetch={refetch} />}
        />
        <Route
          exact
          path="/password/reset/:token"
          name="Reset Password Page"
          render={props => <ResetPassword {...props} refetch={refetch} />}
        />
        <Route
          exact
          path="/email/verify/:id"
          name="Verify Email Page"
          render={props => (
            <VerifyEmail
              {...props}
              session={session}
            />
          )}
        />
        {routes.map(route => (route.component ? (
          <Route
            key={route.name}
            path={route.path}
            exact={route.exact}
            name={route.name}
            render={props => (
              <AuthenticatedLayout {...props} session={session}>
                <route.component {...props} session={session} />
              </AuthenticatedLayout>
            )}
          />
        ) : (null)))}
        <Redirect exact from="/" to="/dashboard" />
        <Route exact path="/500" name="Page 500" render={props => <Page500 {...props} />} />
        <Route
          render={props => ((session && session.me) ? (
            <AuthenticatedLayout {...props} session={session}>
              <NotFound {...props} session={session} />
            </AuthenticatedLayout>
          ) : (
            <NotFound {...props} session={session} />
          ))
          }
        />
      </Switch>
    </React.Suspense>
  </BrowserRouter>
);

MainApp.propTypes = propTypes;
MainApp.defaultProps = defaultProps;

export default withSession(MainApp);
