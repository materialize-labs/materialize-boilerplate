import React from 'react';
import { Query } from 'react-apollo';
import * as Cookies from 'es-cookie';
import { Redirect } from 'react-router-dom';
import { GET_CURRENT_USER } from '../graphql/queries';

/* eslint-disable */
const withAuth = conditionFunc => Component => props => {

  if (props.unitTesting === 'true') {
    return <Component {...props} />
  }

  return (

    <Query query={GET_CURRENT_USER}>

      {({ data, loading, error, refetch }) => {

        if (loading) return null;

        if (typeof document !== 'undefined') {

          const tokenExpired = Cookies.get('token');

          if (tokenExpired == undefined) return <Redirect to="/login" />
        }

        if (props.session.me == null) return <Redirect to="/login" />

        return conditionFunc(data) ? <Component {...props} /> : <Redirect to="/login" />

      }}


    </Query>

  )

};
/* eslint-enable */

export default withAuth;
