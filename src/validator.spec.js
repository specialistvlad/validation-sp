const test = require('unit.js');

const CreateValidator = require('./validation');
const Validators = require('./validators');

describe('validation', () => {
  it('required() field should be checked always', (done) => {
    const pattern = {
      field1: Validators.required(),
    };

    const source = {
      field2: 'some value2',
    };

    const validator = new CreateValidator(pattern);
    validator.validate(source)
      .then((res) => {
        done(res);
      })
      .catch((res) => {
        test.object(res);
        test.object(res.fields);
        test.string(res.fields.field1);
        done();
      });
  });

  it('not required field should be checked if exist', (done) => {
    let called = false;
    const validatorExample = (val) => {
      called = true;
      return val ? null : 'aaa';
    };

    const pattern = {
      field1: validatorExample,
    };

    const source = {
      field1: 'some value1',
      field2: 'some value2',
    };

    const validator = new CreateValidator(pattern);
    validator.validate(source)
      .then(() => {
        test.assert(called);
        done();
      })
      .catch(done);
  });

  it('don\'t run Validators for non existing field', (done) => {
    let called = false;
    const validatorExample = (val) => {
      called = true;
      return val ? null : 'aaa';
    };

    const pattern = {
      field1: validatorExample,
    };

    const source = {
      field2: 'some value2',
    };

    const validator = new CreateValidator(pattern);
    validator.validate(source)
      .then(() => {
        test.assert(!called);
        done();
      })
      .catch(done);
  });

  it('check number validation(positive)', (done) => {
    const source = {
      float: 123.123,
      float2: 123.123,
      number: 123,
      number2: 123,
    };

    const pattern = {
      float: [Validators.required(), Validators.number],
      float2: [Validators.number],
      number: [Validators.required(), Validators.number],
      number2: [Validators.number],
    };

    const validator = new CreateValidator(pattern);
    validator.validate(source)
      .then((res) => { test.object(source).isEqualTo(res); done(); })
      .catch((e) => {
        done(e);
      });
  });

  it('check number validation(negative)', (done) => {
    const source = {
      float2: 'asd',
      float3: 'asd',
      number2: [],
    };

    const pattern = {
      float: [Validators.required(), Validators.number],
      float2: [Validators.number],
      number: [Validators.required(), Validators.number],
      number2: [Validators.number],
    };

    const errors = {
      float: 'Required field',
      float2: 'Should be a number',
      number: 'Required field',
      number2: 'Should be a number',
    };

    const validator = new CreateValidator(pattern);
    validator.validate(source)
      .then(done)
      .catch((res) => { test.object(res.fields).is(errors); done(); });
  });
});
