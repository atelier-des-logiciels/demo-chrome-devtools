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
  .argv;

process.env.NODE_ENV='production';

const webpackConfig = require('../webpack.config');

const tmpFolder = path.resolve(__dirname, 'tmp');
const distFolder = path.resolve(__dirname, '../..', 'dist', 'front');

const configuration = {
  PUPPETEER_OPTIONS: {
    headless: argv.delay === false,
    slowMo: argv.delay,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  },
  HOST: 'http://localhost',
  PORT: 4242,
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
