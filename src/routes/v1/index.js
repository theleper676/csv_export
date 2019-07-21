const Router = require('koa-router');

const analyzeRoutes = require('./analyzeRoutes');
module.exports = () => {
  const router = new Router({ prefix: '/api/v1' });
  router.use(analyzeRoutes());

  return router.routes();
};
