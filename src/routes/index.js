const Router = require('koa-router');
const handler = require('./parseCsv')
module.exports = app => {
  const baseRouter = new Router({
    prefix: '/csv'
  });
  baseRouter.post('/', handler)
  app.use(baseRouter.routes());
  app.use(baseRouter.allowedMethods());
};