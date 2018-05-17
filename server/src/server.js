const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const R = require('ramda');

const getFilter = R.cond([
  [R.equals('active'), () => todo => !todo.done],
  [R.equals('completed'), () => R.prop('done')],
  [R.T, () => R.identity],
]);

const createRouter = (dataPath) => {
  const todoList = require(path.join(path.resolve(dataPath), 'todolist.json'));

  const router = new Router({
    prefix: '/api'
  });

  router.get('/todos', (ctx) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.type= 'JSON';
    
    const timeStart = Date.now();
    const list = R.pipe(
      R.filter(getFilter(ctx.query.filter)),
      R.sortBy(R.prop('date')),
      R.reverse,
      R.map(R.evolve({
        date: d => new Date(d),
        value: R.replace(/^./, R.toLower)
      })),
    )(todoList);

    const dur = Date.now() - timeStart;
    ctx.set('Server-Timing', `cpu;dur=${dur};desc="get todos"`);

    ctx.body = JSON.stringify(list, null, 2);
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