const Router = require('koa-router');
const handlers = require('./handlers');

module.exports = function disvoceryRoutes() {
  const router = new Router({ prefix: '/analyze' });

  router
  .post('/', handlers.analyzeHandlers.postAnalyze);

  return router.routes();
};
