const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const Koa = require('koa');
const {
  errorHandlerMiddleware
} = require('./middleware');

module.exports = () => {
  function initKoa(app) {
    if (app.env !== 'development') {
      app.proxy = true;
    }

    app.use(errorHandlerMiddleware());
    app.use(helmet());
    app.use(bodyParser());

    return app;
  }

  const koa = new Koa();

  koa.on('error', (err, ctx) => {
    log.error('server error', err);
  });

  return initKoa(koa);
};