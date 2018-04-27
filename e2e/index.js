const path = require('path');
const { promisify } = require('util');
const webpack = promisify(require('webpack'));
const rimraf = promisify(require('rimraf'));
const puppeteer = require('puppeteer');

const { getCoverageReport, log } = require('./utils');
const serve = require('../server');


/* ************************************************************************* */

const exitError = (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
};

const build = async (config) => {
  if (config.BUILD) {
    const stats = await webpack(config.WEBPACK_CONFIG)
    const info = stats.toJson();
    if (info.errors.length) {
      throw info.errors[0];
    }
    return stats;
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
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage(),
  ])
  // await page.coverage.startJSCoverage();
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
  const [ jsCoverage, cssCoverage ] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ])
  return { jsCoverage, cssCoverage };
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
  const { jsCoverage, cssCoverage } = await runTests({ tests, config, browser, page });

  await log('close page', page.close());
  await log('close browser', browser.close());
  if (config.BUILD) {
    await log('clean', clean(config));
  }
  await log('stop server', server.close());

  process.stdout.write('\n====== JS and CSS Coverage report ======\n');
  // eslint-disable-next-line no-console
  getCoverageReport([...jsCoverage, ...cssCoverage]).forEach(x => console.log(x))
}

/* ************************************************************************* */


(async () => {
  const tests = require('./tests');
  const config = require('./configuration');

  const server = await log('start server', startServer(config));

  await main(config, server, tests).catch(e => {
    server.close();
    exitError(e);
  });
})();
