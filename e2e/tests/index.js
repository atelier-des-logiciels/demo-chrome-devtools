const { applyTo, pipe, map, filter, reject, equals } = require('ramda');
const { readdirSync } =require('fs');
const path = require('path');

module.exports = applyTo(readdirSync(path.resolve(__dirname)))(
  pipe(
    filter(pipe(path.extname, equals('.js'))),
    reject(equals('index.js')),
    map(testFile => path.resolve(__dirname, testFile)),
    map(require),
  )
);
