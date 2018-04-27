const { pipe, toPairs, map } = require('ramda');

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
const getTodo = page => async todoElement => {
  const input = await todoElement.$('input');
  const divChild = await todoElement.$('div > *');
  const done = await page.evaluate(el => el.checked, input);
  const value = await page.evaluate(el => el.innerText, divChild);
  return { done, value };
}
const getTodoListFromPage = async page => {
  const todolist = await page.$$('#todo');
  return Promise.all(todolist.map(getTodo(page)));
}

/* ************************************************************************* */
module.exports = {
  getCoverageReport,
  getTodoListFromPage,
};
