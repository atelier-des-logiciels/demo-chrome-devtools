const path = require('path');
const { promisify } = require('util');
const webpack = promisify(require('webpack'));
const rimraf = promisify(require('rimraf'));
const puppeteer = require('puppeteer');

const { calculateCoverage, log } = require('./utils');
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
  await page.coverage.startJSCoverage();
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
  const jsCoverage = await page.coverage.stopJSCoverage();
  return { jsCoverage }
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
  const { jsCoverage } = await runTests({ tests, config, browser, page });

  await log('close page', page.close());
  await log('close browser', browser.close());
  if (config.BUILD) {
    await log('clean', clean(config));
  }
  await log('stop server', server.close());

  // eslint-disable-next-line no-console
  console.log(`\nJS bundle ${calculateCoverage(jsCoverage)}% covered`);
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
