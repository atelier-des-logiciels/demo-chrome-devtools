const path = require('path');

const createServer = require('./server');

const staticPath = process.env.ALFRED_STATIC_PATH || path.join(__dirname, '../../front/dist');
const dataPath = process.env.ALFRED_DATA_PATH || path.join(__dirname, '../data');
const port = process.env.ALFRED_PORT || 3000;

createServer({
  staticPath,
  dataPath,
  port,
}).then(() => {
  console.log(`Listening on port ${port}`);
});