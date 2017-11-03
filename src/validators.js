const _ = require('lodash');

class Validators {
  static required() {
    const func = val => (_.isUndefined(val) ? 'Required field' : null);
    func.required = true;
    return func;
  }

  static number() {
    return val => (!_.isNumber(val) ? 'Should be a number' : null);
  }

  static numberOrNull() {
    return val => (val === null || _.isNumber(val) ? null : 'Should be a number or null');
  }

  static text() {
    return val => (!_.isString(val) ? 'Should be string' : null);
  }

  static boolean() {
    return val => (!_.isBoolean(val) ? 'Should be boolean' : null);
  }
  static array() {
    return val => (!_.isArray(val) ? 'Should be array' : null);
  }

  static lengthMore(len) {
    return val => (_.isNil(val) || val.length <= len ?
      `Field length must be more than ${len}` : null);
  }

  static lengthZeroOrMoreThan(len) {
    return val => (val.length !== 0 && val.length <= len ?
      `Field length must be more than ${len}` : null);
  }

  static oneOf(...args) {
    return val => (args.includes(val) ? null : `Should be one of ${args.join(',')}`);
  }
}

module.exports = Validators;
