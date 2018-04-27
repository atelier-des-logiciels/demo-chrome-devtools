const { repeat, pipe, toPairs, map } = require('ramda');


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
  const result = {};

  for (const entry of coverage) {
    let usedBytes = 0;
    const totalBytes = entry.text.length;
    for (const range of entry.ranges) {
      usedBytes += range.end - range.start - 1;
    }
    const percentage = usedBytes / totalBytes * 100;
    result[entry.url] = Math.trunc(percentage * 100) / 100;
  }
  return result;
}

const getCoverageReport = pipe(
  calculateCoverage,
  toPairs,
  map(([url, percentage]) => (
    `[${percentage}% covered] ${url}`
  )),
)

/* ************************************************************************* */
module.exports = {
  getCoverageReport,
  log: createLog(),
};
