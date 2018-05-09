const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');

const createRouter = (dataPath) => {
  const todoList = require(path.join(process.cwd(), dataPath, 'todolist.json'));

  const router = new Router({
    prefix: '/api'
  });

  router.get('/todos', (ctx) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.body = JSON.stringify(todoList, null, 2);
    ctx.type= 'JSON';
  });

  return router;
}

const createServer = ({ staticPath, dataPath, port }) => {
  const app = new Koa();
  const router = createRouter(dataPath);

  app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(staticPath));

  return new Promise(r => {
    const server = app.listen(port, () => r(server));
  });
}

module.exports = createServer;