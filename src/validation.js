const _ = require('lodash');
const Promise = require('bluebird');
const objectPath = require('object-path');
const eFactory = require('./errors');

class Validation {
  static create(...args) {
    const instance = new Validation(...args);
    return instance.validate;
  }

  constructor(pattern, initOptions) {
    this.initOpts = initOptions;
    if (!pattern || _.keys(pattern).length === 0) {
      throw new eFactory.PatternEmpty();
    }

    const unknownValidators = _.flatten(_.values(pattern)).filter(val => !_.isFunction(val));

    if (unknownValidators.length > 0) {
      throw new eFactory.UnknownValidators(unknownValidators, pattern);
    }

    this.pattern = pattern;
    this.validate = this.validate.bind(this);
  }

  async validate(data, options) {
    const result = await this.templateValidation(data, options);
    return this.userHandleResult(await this.handleResults(result, data));
  }

  async templateValidation(data, options) {
    return Promise.props(_.mapValues(
      this.pattern,
      (value, key) => this.propValidation(data, key, options),
    ));
  }

  async propValidation(data, key, options) {
    const fieldValue = objectPath.get(data, key);
    const value = this.pattern[key];
    const validators = _.isArray(value) ? value : [value];

    if (_.isUndefined(fieldValue) && !(validators[0] || {}).required) {
      return undefined;
    }

    const opts = {
      ...this.initOpts,
      ...options,
      source: data,
      propName: key,
    };

    return this.runValidators(validators, fieldValue, opts);
  }

  async runValidators(validatorsList, valueToValidate, options) {
    for (let i = 0; i < validatorsList.length; i += 1) {
      const validator = validatorsList[i];
      // It is expected behavior to run validators in serial
      // First found error stops execution
      // eslint-disable-next-line no-await-in-loop
      const result = await validator(valueToValidate, options);
      if (_.isFunction(result)) {
        throw new Error(`Validation result should not be a function, did you forget ()?
          propName:${options.propName}
          result: ${result}
          validator: ${validator}
        `);
      }
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  async handleResults(res, data, options) {
    const errors = _.pickBy(res, value => !_.isEmpty(value));

    if (_.keys(errors).length === 0) {
      return this.prepareResolving(data);
    }

    return this.prepareRejection(errors, data, options);
  }

  async prepareResolving(arg) {
    return arg;
  }

  async prepareRejection(...args) {
    throw new eFactory.ValidationError(...args);
  }

  async userHandleResult(arg) {
    return arg;
  }
}

module.exports = Validation;
