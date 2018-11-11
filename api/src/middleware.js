const uuid = require("uuid/v4");

function logger() {
  return async (ctx, next) => {
    const t1 = Date.now();
    ctx.requestId = uuid();
    ctx.response.headers["x-request-id"] = ctx.requestId;
    await next();
    const t2 = Date.now();
    console.log(
      `[${ctx.request.method}] ${ctx.request.path}: status=${ctx.response.status} requestId=${
        ctx.requestId
      } (${t2 - t1}ms)`
    );
  };
}

function errors() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.error(err);

      ctx.status = err.status || 500;
      if (ctx.status >= 500) {
        ctx.body = { message: "ServerError" };
      } else if (ctx.status >= 400) {
        ctx.body = {
          message: err.message,
          errors: err.errors
        };
      }
    }
  };
}

module.exports = { logger, errors };
