const { repeat } = require('ramda');
const clc = require('cli-color');

/* ************************************************************************* */

const createLog = (nIndent = 0) => {
  const log = async (arg, f) => {
    const indent = repeat(' ', nIndent).join('');
    process.stdout.write(`${indent}=> ${arg} `);
    let promise = f;
    if (typeof f === 'function') {
      promise = f();
    }
    const result = await promise;
    process.stdout.write(`${clc.green('[OK]')}\n`);
    return result;
  };

  log.withIndent = (n = 2) => createLog(nIndent + n);

  return log;
};

module.exports = createLog();
