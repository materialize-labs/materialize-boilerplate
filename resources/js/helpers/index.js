import * as Cookies from 'es-cookie';
import { unCamelCase } from './strings';

export const sessionCheck = session => session && session.me;

export const parseGraphqlErrors = (errors, keyMap) => {
  const validationErrors = [];
  const serverErrors = [];
  const keyNameMap = keyMap || {};
  errors.graphQLErrors.forEach((err) => {
    if (err.extensions.validation) {
      const validations = err.extensions.validation;
      Object.keys(validations).forEach((key) => {
        let path = key.substring(0, key.lastIndexOf('.') + 1).replace('_', ' ');
        path = unCamelCase(path);
        const originalFieldName = key.substring(key.lastIndexOf('.') + 1, key.length);
        let fieldName = originalFieldName;
        if (keyNameMap[fieldName]) {
          fieldName = keyNameMap[fieldName];
        }
        const re = new RegExp(path, 'g');
        const message = validations[key].join('\n').replace(re, '');
        const fieldNamePath = key.replace('data.', '')
          .replace(/(\.(?:create|connect|update|sync|delete|disconnect))\./gm, '.')
          .replace(/\.(\d*)\./, '[$1].')
          .replace(originalFieldName, fieldName);
        validationErrors.push({ field: fieldNamePath, message });
      });
    } else {
      const { message, extensions = {} } = err;
      serverErrors.push({ message, ...extensions });
    }
  });
  return { serverErrors, validationErrors };
};

export const logout = (client, history, queryParams) => {
  Cookies.remove('token');
  if (client) {
    client.resetStore();
  }
  const path = queryParams ? `/login?${queryParams}` : '/login';
  history.push(path);
};

export default {};
