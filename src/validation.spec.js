const _ = require('lodash');
const test = require('unit.js');

const CreateValidator = require('./validation');
const validators = require('./validators');

describe('validation', () => {
  const pattern1 = { test: val => val };

  it('create validator is function', (done) => {
    test.function(CreateValidator);
    done();
  });

  it('create validator return object', (done) => {
    const validator = new CreateValidator(pattern1);
    test.object(validator);
    test.function(validator.validate);
    done();
  });

  it('run validation should return promise', () => {
    const validator = new CreateValidator(pattern1).validate();
    test.function(validator.then);
    test.function(validator.catch);
  });

  it('check promise resoving', (done) => {
    const validator = new CreateValidator(pattern1);
    validator.validate({ test: null })
      .then(() => done())
      .catch(done);
  });

  it('check promise rejecting', (done) => {
    const validator = new CreateValidator(pattern1);
    validator.validate({ test: 'should be returned as error' })
      .then(done)
      .catch(() => done());
  });

  it('check rejecting fields', (done) => {
    const validator = new CreateValidator(pattern1);
    validator.validate({ test: 'should be returned as error' })
      .then(done)
      .catch((res) => {
        test.object({
          test: 'should be returned as error',
        }).is(res.fields);
        done();
      });
  });

  it('check all pattern definition ways', (done) => {
    const source = {
      field: 123.123,
      field2: 123,
      field3: 'some text value',
    };

    const pattern = {
      field: validators.required(),
      field2: [validators.required()],
      field3: [validators.required(), validators.text()],
    };

    const validator = new CreateValidator(pattern);
    validator.validate(source)
      .then((res) => {
        test.object(source).isEqualTo(res);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it('transpose run time options to every single validator', (done) => {
    const runOptions = { key1: 'value1', key2: [1, 2, 3] };
    const validatorExample = (val, options) => {
      test.object(_.pick(options, _.keys(runOptions))).is(runOptions);
    };

    const validator = new CreateValidator({ test: validatorExample });
    validator.validate({ test: 'value' }, runOptions)
      .then(() => done())
      .catch(done);
  });

  it('transpose init time options to every single validator checkField(val, options)', (done) => {
    const initOptions = { key1: 'value1', key2: [1, 2, 3] };
    const validatorExample = (val, options) => {
      test.object(_.pick(options, _.keys(initOptions))).is(initOptions);
    };

    const validator = new CreateValidator({ test: validatorExample }, initOptions);
    validator.validate({ test: 'value' })
      .then(() => done())
      .catch(done);
  });

  it('check options overwriting (run time opts overwrite init time opts)', (done) => {
    const runOptions = { key1: 'value1', key2: [1, 2, 3] };
    const initOptions = { key3: 'value2', key2: [1, 2, 3, 4, 5, 6] };
    const resultOptions = Object.assign({}, initOptions, runOptions);
    const resultKeys = _.keys(resultOptions);

    const validatorExample = (val, options) => {
      test.object(_.pick(options, resultKeys)).is(resultOptions);
    };

    const validator = new CreateValidator({ test: validatorExample }, initOptions);
    validator.validate({ test: 'value' }, runOptions)
      .then(() => done())
      .catch(done);
  });

  it('every single validator should called with 2 params', (done) => {
    const keyName = 'test';
    const keyValue = 'my test';
    const validatorExample = (val, options) => {
      test.value(val).is(keyValue);
      test.object(options);
    };

    const validator = new CreateValidator({ [keyName]: validatorExample });
    validator.validate({ [keyName]: keyValue })
      .then(() => done())
      .catch(done);
  });

  it('don\'t run validators for non existing field', (done) => {
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
  xit('single validator can be promise', (done) => { done(); });
  xit('single validator should correct resolves field validation', (done) => { done(); });
  xit('single validator should correct rejects field validation', (done) => { done(); });
  xit('single validator can be async function', (done) => { done(); });
});
