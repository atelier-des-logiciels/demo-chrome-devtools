const { repeat } = require('ramda');
const path = require('path');
const { promisify } = require('util');
const mkdirp = require('mkdirp-promise');
const webpack = promisify(require('webpack'));
const rimraf = promisify(require('rimraf'));
const serve = require('serve');
const puppeteer = require('puppeteer');


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

const log = createLog();

const exitError = (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
};

const build = (config) => webpack(config.WEBPACK_CONFIG);
const clean = (config) => rimraf(config.TMP_FOLDER);

const startServer = async (config) => {
  await mkdirp(config.TMP_FOLDER);
  return serve(path.join(config.TMP_FOLDER), config.SERVER_OPTIONS)
};

const startBrowser = (config) => puppeteer.launch(config.PUPPETEER_OPTIONS);

const runTests = async ({ tests, config, browser, page }) => {
  await page.goto(`${config.HOST}:${config.SERVER_OPTIONS.port}`)
  for (const test of tests) {
    await test({ config, browser, page, log: log.withIndent() });
  }
}

/* ************************************************************************* */


const main = async (config, server, tests) => {
  await log('build', build(config));

  const browser = await log('start browser', startBrowser(config));
  const page = await log('open a new page', browser.newPage());
  try {
    // eslint-disable-next-line no-console
    console.log('=> run tests...');
    await runTests({ tests, config, browser, page })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }

  await log('close page', page.close());
  await log('close browser', browser.close());
  await log('clean', clean(config));
  await log('stop server', server.stop());
}

/* ************************************************************************* */


(async () => {
  const tests = require('./tests');
  const config = require('./configuration');

  const server = await log('start server', startServer(config));

  await main(config, server, tests).catch(e => {
    server.stop();
    exitError(e);
  });
})();
