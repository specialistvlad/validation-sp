const isEmpty = require('lodash/isEmpty');
const isArray = require('lodash/isArray');
const isUndefined = require('lodash/isUndefined');
const isFunction = require('lodash/isFunction');
const flatten = require('lodash/flatten');
const values = require('lodash/values');
const pickBy = require('lodash/pickBy');
const get = require('lodash/get');

const eFactory = require('./errors');

class Validation {
  static create(...args) {
    const instance = new Validation(...args);
    return instance.validate;
  }

  constructor(pattern, initOptions) {
    this.initOpts = initOptions;
    if (!pattern) {
      throw new eFactory.PatternEmpty();
    }

    const pt = { ...pattern };
    if (Object.keys(pt).length === 0) {
      throw new eFactory.PatternEmpty();
    }

    const unknownValidators = flatten(values(pt)).filter(val => !isFunction(val));

    if (unknownValidators.length > 0) {
      throw new eFactory.UnknownValidators(unknownValidators, pattern);
    }

    this.pattern = pattern;
    this.validate = this.validate.bind(this);
  }

  async validate(data, options) {
    const result = await this.templateValidation({ ...data }, options);
    return this.userHandleResult(await this.handleResults(result, data));
  }

  async templateValidation(data, options) {
    const result = {};

    const propsMapper = async (key) => {
      result[key] = await this.propValidation(data, key, options);
    };

    await Promise.all(Object.keys(this.pattern).map(propsMapper));
    return result;
  }

  async propValidation(data, key, options) {
    const fieldValue = get(data, key);
    const value = this.pattern[key];
    const validators = isArray(value) ? value : [value];

    if (isUndefined(fieldValue) && !(validators[0] || {}).required) {
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
      // eslint-disable-next-line no-await-in-loop
      const result = await validator(valueToValidate, options);
      if (result) {
        return result;
      }
    }
    return undefined;
  }

  async handleResults(res, data, options) {
    const errors = pickBy(res, value => !isEmpty(value));

    if (Object.keys(errors).length === 0) {
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
