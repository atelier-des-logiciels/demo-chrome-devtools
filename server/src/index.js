const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');

const todoList = require('./todolist.json');

module.exports = (folder = '.', port = 3000) => (
  new Promise(resolve => {
    const app = new Koa();
    const router = new Router({
      prefix: '/api'
    });

    router.get('/todos', (ctx) => {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.body = JSON.stringify(todoList, null, 2);
      ctx.type= 'JSON';
    });

    app
      .use(router.routes())
      .use(router.allowedMethods())
      .use(serve(folder));

    const server = app.listen(port, async () => {
      resolve(server);
    });
  })
);
