const path = require('path');

const DEFAULT_PORT = 3000;
const DEFAULT_DIST_FOLDER = './dist';

const argv = require('yargs')
  .usage('Usage: $0 [--port] [folder]')
  .describe('version', 'Print current version')
  .help('h')
  .alias('h', 'help')
  .describe('p', 'port to listen')
  .alias('p', 'port')
  .default('p', DEFAULT_PORT)
  .nargs('p', 1)
  .argv;

const createServer = require('.');

const defaultDistFolder = path.join(__dirname, '..', DEFAULT_DIST_FOLDER);
const folder = path.resolve(argv._[0] || defaultDistFolder);
const port = argv.port;

createServer(folder, argv.port).then(() => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
