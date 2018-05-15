const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');

const createRouter = (dataPath) => {
  const todoList = require(path.join(path.resolve(dataPath), 'todolist.json'));

  const router = new Router({
    prefix: '/api'
  });

  router.get('/todos', (ctx) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.type= 'JSON';

    let todos = todoList;

    if (ctx.query.filter === 'active') {
      todos = todoList.filter(t => !t.done);
    } else if (ctx.query.filter === 'completed') {
      todos = todoList.filter(t => t.done);
    }

    ctx.body = JSON.stringify(todos, null, 2);
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