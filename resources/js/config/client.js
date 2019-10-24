import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject,
} from 'apollo-cache-inmemory';
import * as Cookies from 'es-cookie';
import introspectionQueryResultData from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = Cookies.get('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const dataIdFromBoardTypeTaskStatus = (object) => {
  const tasks = object.tasks
    ? `.${object.tasks.map(task => task.id).join()}`
    : '';
  const key = object.id || object.value;
  return `${object.__typename}.${key}${tasks}`;
};

const client = new ApolloClient({
  credentials: 'same-origin',
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    fragmentMatcher,
    dataIdFromObject: (object) => {
      switch (object.__typename) {
      case 'BoardTypeTaskStatus': return dataIdFromBoardTypeTaskStatus(object);
      default: return defaultDataIdFromObject(object);
      }
    },
  }),
});

export default client;
