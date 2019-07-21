const Router = require('koa-router');
const v1Routes = require('./v1');

module.exports = app => {
  const baseRouter = new Router();
  baseRouter.get('/health_check', ctx => {
    ctx.body = { result: 'pong' };
  });

  baseRouter.use(v1Routes());
  app.use(baseRouter.routes());
  app.use(baseRouter.allowedMethods());
};
