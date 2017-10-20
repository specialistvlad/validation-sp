const test = require('unit.js');

const lib = require('./');

describe('index file', () => {
  it('index returns object', (done) => {
    test.object(lib);
    done();
  });

  it('check index props', (done) => {
    test.function(lib.create);
    test.function(lib.Validation);
    test.function(lib.Validators);
    test.object(lib.errors);
    done();
  });
});
