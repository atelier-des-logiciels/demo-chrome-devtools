const { repeat } = require('ramda');


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
    process.stdout.write('[OK]\n');
    return result;
  };

  log.withIndent = (n = 2) => createLog(nIndent + n);

  return log;
};

/* ************************************************************************* */
const calculateCoverage = (coverage) => {
  let usedBytes = 0;
  let totalBytes = 0;

  for (const entry of coverage) {
    totalBytes += entry.text.length;
    for (const range of entry.ranges)
      usedBytes += range.end - range.start - 1;
  }
  if (!totalBytes) {
    return 0;
  }
  const percentage = usedBytes / totalBytes * 100;
  return Math.trunc(percentage * 100) / 100;
}

/* ************************************************************************* */
module.exports = {
  calculateCoverage,
  log: createLog(),
};
