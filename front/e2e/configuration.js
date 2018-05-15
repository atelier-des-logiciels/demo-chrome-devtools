const { always, evolve } = require('ramda');
const path = require('path');

const argv = require('yargs')
  .usage('Usage: $0 [-d]')
  .describe('version', 'Print current version')
  .help('h')
  .alias('h', 'help')
  .describe('d', 'Add delay (in ms) between operations and run a full version of Chromium')
  .default('d', false)
  .alias('d', 'delay')
  .nargs('d', 1)
  .boolean('build')
  .describe('build', 'rebuild the App in a tmp/ folder')
  .default('build', true)
  .describe('s', 'minimum score for lighthouse')
  .default('s', 20)
  .alias('s', 'score')
  .alias('t', 'run-tests')
  .boolean('t')
  .describe('t', 'run tests done with puppeteer')
  .default('t', true)
  .alias('a', 'run-audit')
  .boolean('a')
  .describe('a', 'run audit done with lighthouse')
  .default('a', true)
  .argv;

process.env.NODE_ENV='production';

const webpackConfig = require('../webpack.config');

const tmpFolder = path.resolve(__dirname, 'tmp');
const distFolder = path.resolve(__dirname, '..', 'dist');

const configuration = {
  PUPPETEER_OPTIONS: {
    headless: argv.delay === false,
    slowMo: argv.delay,
    devtools: true,
  },
  HOST: 'http://localhost',
  PORT: 4242,
  BUILD: argv.build,
  SCORE: argv.score,
  RUN_TESTS: argv.t,
  RUN_AUDIT: argv.a,
  DIST_FOLDER: argv.build ? tmpFolder : distFolder,
  TEST_FOLDER: path.resolve(__dirname, 'tests'),
};

const getWebpackTestConfig = evolve({
  output: {
    path: always(configuration.DIST_FOLDER),
  },
});


module.exports = {
  ...configuration,
  getUrl: () => `${configuration.HOST}:${configuration.PORT}`,
  WEBPACK_CONFIG: getWebpackTestConfig(webpackConfig),
}
