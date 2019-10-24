import * as Yup from 'yup';
import moment from 'moment';
import { isValidPhoneNumber } from 'react-phone-number-input';

Yup.addMethod(Yup.string, 'isValidJSON', function checkJSON(msg) {
  return this.test({
    name: 'isValidJSON',
    message: msg || 'JSON not valid.',
    test: (value) => {
      try {
        JSON.parse(value);
        return true;
      } catch (e) {
        return false;
      }
    },
  });
});

Yup.addMethod(Yup.mixed, 'dateBefore', function dateBefore(field, msg, granularity) {
  const timeGranularity = granularity || 'day';
  return this.test({
    name: 'dateBefore',
    message: msg || 'Date must be before',
    test(startDate) {
      const endDate = this.parent[field];
      return moment(startDate).isSameOrBefore(moment(endDate), timeGranularity);
    },
  });
});

Yup.addMethod(Yup.mixed, 'dateAfter', function dateAfter(field, msg, granularity) {
  const timeGranularity = granularity || 'day';
  return this.test({
    name: 'dateAfter',
    message: msg || 'Date must be after',
    test(date1) {
      const date2 = this.parent[field];
      return moment(date1).isSameOrAfter(moment(date2), timeGranularity);
    },
  });
});

Yup.addMethod(Yup.string, 'phone', function checkPhone(msg, required) {
  return this.test({
    name: 'phone',
    message: msg || 'Phone number is invalid.',
    test: (value) => {
      if (!required && (value === null || value === '')) {
        return true;
      }
      return isValidPhoneNumber(value);
    },
  });
});
