const path = require('path');
const { promisify } = require('util');
const mkdirp = require('mkdirp-promise');
const webpack = promisify(require('webpack'));
const rimraf = promisify(require('rimraf'));
const serve = require('serve');
const puppeteer = require('puppeteer');


/* ************************************************************************* */
const log = (...args) => {
  // eslint-disable-next-line no-console
  console.log('=>', ...args);
};

const error = (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
}

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
    await test({ config, browser, page });
  }
}

/* ************************************************************************* */


const main = async (config, server, tests) => {

  await build(config);
  log('build [OK]');

  const browser = await startBrowser(config);
  log('start browser [OK]');

  const page = await browser.newPage();
  log('open a new page [OK]');

  await runTests({ tests, config, browser, page });
  log('run tests [OK]');

  await page.close();
  log('close page [OK]');

  await browser.close();
  log('close browser [OK]');

  await clean(config);
  log('clean [OK]');

  server.stop();
  log('stop server [OK]');
}

/* ************************************************************************* */


(async () => {
  const config = require('./configuration');
  const server = await startServer(config);
  const tests = require('./tests');

  log('start server [OK]');
  main(config, server, tests).catch(e => {
    server.stop();
    error(e);
  });
})();
