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
  .argv;


const webpackConfig = require('../webpack.config');

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
  TMP_FOLDER: path.resolve(__dirname, 'tmp'),
  TEST_FOLDER: path.resolve(__dirname, 'tests'),
};

const getWebpackTestConfig = evolve({
  output: {
    path: always(configuration.TMP_FOLDER),
  },
});


module.exports = {
  ...configuration,
  WEBPACK_CONFIG: getWebpackTestConfig(webpackConfig),
}
