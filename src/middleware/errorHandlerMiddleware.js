const http = require('http');

const DEFAULT_ACCEPTS = ['json', 'text'];

module.exports = ({ accepts, json, html, text } = {}) => {
  const acceptsToUse = accepts || DEFAULT_ACCEPTS;

  return async function errorHandlerMiddleware(ctx, next) {
    try {
      await next();
    } catch (err) {
      ctx.state.err = err;
      ctx.status = err.statusCode || err.status || 500;
      const out = {
        error: err.message,
      };

      switch (ctx.accepts(acceptsToUse)) {
        case 'json': {
          if (json) {
            json(ctx, out);
          } else {
            ctx.body = out;
          }
          break;
        }
        case 'text':
          if (text) {
            text(ctx, out);
          } else {
            ctx.body = out.error;
          }
          break;
        case 'html':
          if (html) {
            html(ctx, out);
          } else {
            ctx.redirect('/error');
          }
          break;
        default:
          ctx.status = 406;
          ctx.body = http.STATUS_CODES[ctx.status];
      }
    }
  };
};
