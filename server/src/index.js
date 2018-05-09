const createServer = require('./server');

const staticPath = process.env.TODO_STATIC_PATH || '../front/dist';
const dataPath = process.env.TODO_DATA_PATH || './data';
const port = process.env.TODO_PORT || 3000;

createServer({
  staticPath,
  dataPath,
  port,
}).then(() => {
  console.log(`Listening on port ${port}`);
});