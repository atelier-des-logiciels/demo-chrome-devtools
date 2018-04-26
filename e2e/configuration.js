const { always, evolve } = require('ramda');
const path = require('path');

const argv = require('yargs')
  .usage('Usage: $0 [-d]')
  .describe('version', 'Print current version')
  .help('h')
  .alias('h', 'help')
  .describe('d', 'Add delay (in ms) between operations and run a full version of Chromium')
  .default('d', 0)
  .alias('d', 'delay')
  .nargs('d', 1)
  .boolean('build')
  .describe('build', 'rebuild the App in a tmp/ folder')
  .default('build', true)
  .argv;

const webpackConfig = require('../webpack.config');

const tmpFolder = path.resolve(__dirname, 'tmp');
const distFolder = path.resolve(__dirname, '..', 'dist');

const configuration = {
  PUPPETEER_OPTIONS: {
    headless: !argv.delay,
    slowMo: argv.delay,
  },
  HOST: 'http://localhost',
  SERVER_OPTIONS: {
    port: 4242,
    clipless: true,
    silent: true,
  },
  BUILD: argv.build,
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
  WEBPACK_CONFIG: getWebpackTestConfig(webpackConfig),
}
