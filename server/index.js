const Koa = require('koa');
const serve = require('koa-static');

module.exports = (folder = '.', port = 3000) => (
  new Promise(resolve => {
    const app = new Koa();
    app.use(serve(folder));
    const server = app.listen(port, async () => {
      resolve(server);
    })
  })
);
