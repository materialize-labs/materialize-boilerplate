import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.func.isRequired,
};

const WithApolloClient = props => (
  <ApolloConsumer>
    {client => props.children(client)}
  </ApolloConsumer>
);

WithApolloClient.propTypes = propTypes;

export default WithApolloClient;
