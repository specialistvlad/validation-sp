const _ = require('lodash');
// const moment = require('moment');

// basic signature is - const validateFunction = (val, key, options) => {}
// return null or undefined if no errors found or other else if is
class Validators {
  static required() {
    const func = val => (_.isUndefined(val) ? 'Required field' : null);
    func.required = true;
    return func;
  }

  static number(val) {
    return !_.isNumber(val) ? 'Should be a number' : null;
  }

  static numberOrNull(val) {
    return val === null || _.isNumber(val) ? null : 'Should be a number or null';
  }

  static text(val) {
    return !_.isString(val) ? 'Should be string' : null;
  }

  static boolean(val) {
    return !_.isBoolean(val) ? 'Should be boolean' : null;
  }
  static array(val) {
    return !_.isArray(val) ? 'Should be array' : null;
  }

  static lengthMore(len) {
    return val => (_.isNil(val) || val.length <= len ?
      `Field length must be more than ${len}` : null);
  }

  static lengthZeroOrMoreThan(len) {
    return val => (val.length !== 0 && val.length <= len ?
      `Field length must be more than ${len}` : null);
  }

  // static date(val) {
  //   return moment(val).isValid() ? null : 'Should be a date format';
  // }

  static oneOf(...args) {
    return val => (args.includes(val) ? null : `Should be one of ${args.join(',')}`);
  }
}

module.exports = Validators;
