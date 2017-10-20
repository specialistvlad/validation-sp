const util = require('util');

class PatternEmpty extends Error {
  constructor() {
    super('Validation pattern is empty');
  }
}

class UnknownValidators extends Error {
  constructor(arr) {
    super(`Unknown validator ${arr}`);
  }
}

class ValidationError extends Error {
  constructor(fields) {
    super('Validation error');
    this.fields = fields;
  }

  toString() {
    return `${super.toString()} \r\n ${util.inspect(this.fields, { depth: 2 })}`;
  }
}

module.exports = {
  PatternEmpty,
  ValidationError,
  UnknownValidators,
};
