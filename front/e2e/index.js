const clc = require('cli-color');
const path = require('path');
const { promisify } = require('util');
const pti = require('puppeteer-to-istanbul');
const webpack = promisify(require('webpack'));
const rimraf = promisify(require('rimraf'));
const puppeteer = require('puppeteer');

const { getCoverageReport } = require('./utils');
const log = require('./log');

const serve = require('../../server/src/server');


/* ************************************************************************* */

const exitError = (err) => {
  // eslint-disable-next-line no-console
  console.error(clc.red(err));
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
  serve({
    staticPath: path.join(config.DIST_FOLDER),
    port: config.PORT,
    dataPath: __dirname,
  })
);

const startBrowser = (config) => puppeteer.launch(config.PUPPETEER_OPTIONS);

const runTests = async ({ tests, config, browser, page }) => {
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push({ type: 'error', text: msg.text() });
    } else if (msg.type() === 'warning') {
      consoleMessages.push({ type: 'warning', text: msg.text() });
    }
  });

  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage(),
  ])
  await page.goto(`${config.HOST}:${config.PORT}`)
  for (const test of tests) {
    const runningTest = test.run({ config, browser, page })
    try {
      await log.withIndent()(test.file, runningTest);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(clc.red(e));
      process.exitCode = 1;
    }
  }
  const [ jsCoverage, cssCoverage ] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ])
  pti.write(jsCoverage);
  return { jsCoverage, cssCoverage, consoleMessages };
}

const checkConsoleUsage = ({ consoleMessages }) => {
  consoleMessages.length && process.stdout.write('\n');
  consoleMessages.forEach(({ type, text }) => {
    const color = type === 'error' ? 'red' : 'yellow'
    const paint = clc[color]
    // eslint-disable-next-line no-console
    console.log(`${paint.bold(type)}: ${paint(text)}`);
  });
  consoleMessages.length && process.stdout.write('\n');
  if (consoleMessages.length) {
    throw new Error('There is one or more "console.error" and/or "console.warn"');
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
  const testReport = await runTests({ tests, config, browser, page });
  const { jsCoverage, cssCoverage } = testReport

  await log('close page', page.close());
  await log('close browser', browser.close());
  if (config.BUILD) {
    await log('clean', clean(config));
  }
  await log('stop server', server.close());

  process.stdout.write('\n=> JS and CSS bundles coverage report\n');
  getCoverageReport([...jsCoverage, ...cssCoverage]).forEach(x => (
    // eslint-disable-next-line no-console
    console.log(clc.italic.yellow(x))
  ))

  checkConsoleUsage(testReport);
}

/* ************************************************************************* */


(async () => {
  const tests = require('./tests');
  const config = require('./configuration');

  const server = await log('start server', startServer(config));

  // await new Promise((resolve) => setTimeout(() => { resolve()}, 5000));

  await main(config, server, tests).catch(e => {
    server.close();
    exitError(e);
  });
})();
