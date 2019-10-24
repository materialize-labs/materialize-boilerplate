import _ from 'lodash';

export const caseInsensitiveStringContains = function caseInsensitiveStringContains(
  item,
  key,
  value,
) {
  const val = _.get(item, key);
  if (!val) return false;
  return val.toLowerCase().indexOf(value.toLowerCase()) !== -1;
};

const filterMethods = {
  text(collection, keys, value) {
    if (!value || value.length === 0) return collection;

    const keysArray = (keys.constructor === String) ? [keys] : keys;
    return collection.filter((item) => {
      for (let i = 0; i < keysArray.length; i += 1) {
        if (caseInsensitiveStringContains(item, keysArray[i], value)) {
          return true;
        }
      }
      return false;
    });
  },
  equals(collection, keys, value) {
    if (value.length === 0) return collection;
    const keysArray = (keys.constructor === String) ? [keys] : keys;
    return collection.filter((item) => {
      for (let i = 0; i < keysArray.length; i += 1) {
        if (item[keysArray[i]] === value) {
          return true;
        }
      }
      return false;
    });
  },
};

export const filterCollection = function filterCollection(collection, filters) {
  let results = collection;
  filters.forEach((filterParams) => {
    const { type: method, keys, value } = filterParams;
    results = filterMethods[method](results, keys, value);
  });

  return results;
};
