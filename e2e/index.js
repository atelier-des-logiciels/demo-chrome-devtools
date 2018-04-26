const path = require('path');
const { promisify } = require('util');
const webpack = promisify(require('webpack'));
const rimraf = promisify(require('rimraf'));
const puppeteer = require('puppeteer');

const log = require('./log');
const serve = require('../server');


/* ************************************************************************* */

const exitError = (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
};

const build = (config) => {
  if (config.BUILD) {
    return webpack(config.WEBPACK_CONFIG)
  }
};

const clean = (config) => {
  if (config.BUILD) {
    return rimraf(config.DIST_FOLDER)
  }
};

const startServer = (config) => (
  serve(path.join(config.DIST_FOLDER), config.PORT)
);

const startBrowser = (config) => puppeteer.launch(config.PUPPETEER_OPTIONS);

const runTests = async ({ tests, config, browser, page }) => {
  await page.goto(`${config.HOST}:${config.PORT}`)
  for (const test of tests) {
    const runningTest = test.run({ config, browser, page })
    try {
      await log.withIndent()(test.file, runningTest);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`\n${e}`);
      process.exitCode = 1;
    }
  }
}

/* ************************************************************************* */


const main = async (config, server, tests) => {
  if (config.BUILD) {
    await log('build', build(config));
  }

  const browser = await log('start browser', startBrowser(config));
  const page = await log('open a new page', browser.newPage());
  // eslint-disable-next-line no-console
  console.log('=> run tests...');
  await runTests({ tests, config, browser, page });

  await log('close page', page.close());
  await log('close browser', browser.close());
  if (config.BUILD) {
    await log('clean', clean(config));
  }
  await log('stop server', server.close());
}

/* ************************************************************************* */


(async () => {
//   const [jsCoverage, cssCoverage] = await Promise.all([
//   page.coverage.stopJSCoverage(),
//   page.coverage.stopCSSCoverage(),
// ]);
// let totalBytes = 0;
// let usedBytes = 0;
// const coverage = [...jsCoverage, ...cssCoverage];
// for (const entry of coverage) {
//   totalBytes += entry.text.length;
//   for (const range of entry.ranges)
//     usedBytes += range.end - range.start - 1;
// }
// console.log(`Bytes used: ${usedBytes / totalBytes * 100}%`);
  const tests = require('./tests');
  const config = require('./configuration');

  const server = await log('start server', startServer(config));

  await main(config, server, tests).catch(e => {
    server.close();
    exitError(e);
  });
})();
