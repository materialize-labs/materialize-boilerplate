import _ from 'lodash';

export const partitionRelationData = (valueArray, startingObj) => {
  // Get the values that are to be deleted
  let deleted = [];
  if (startingObj !== undefined) {
    const looped = startingObj.map((val) => {
      const found = _.find(valueArray, val2 => val2.id === val.id);

      return found === undefined
        ? val.id
        : null;
    });

    deleted = looped.filter(el => el != null);
  }

  // Get the values for created and updated
  const values = valueArray.filter((value) => {
    let test = value;
    if (typeof value === 'object') {
      test = Object.values(value).join('');
    }
    return test.length > 0;
  });
  if (values.length === 0) {
    return {};
  }

  // If "is_primary" is blank, set it to 0
  _.forEach(values, (value) => {
    _.forEach(value, (item, key) => {
      if (key === 'is_primary') {
        if (item === null || item === undefined || item === '') {
          value.is_primary = 0;
        }
      }
    });
  });

  const [update, create] = _.partition(values, item => item.id);

  return { create, update, delete: deleted };
};

export const replaceNullWithEmptyString = (object) => {
  const newObject = Object.assign({}, object);
  Object.keys(object).forEach((key) => {
    if (newObject[key] === null) {
      newObject[key] = '';
    }
  });
  return newObject;
};

export const isObjectEmpty = (object) => {
  const newObject = Object.assign({}, object);
  let isEmpty = true;
  Object.keys(object).forEach((key) => {
    if (newObject[key]) {
      isEmpty = false;
    }
  });
  return isEmpty;
};

export const partitionRelationIds = (current, submitted) => (
  Object.assign({}, {
    disconnect: _.difference(current, submitted),
  }, submitted.reduce((acc, el) => {
    if (!current.includes(el)) {
      acc.connect.push(el);
    }
    return acc;
  }, {
    connect: [],
  }))
);
