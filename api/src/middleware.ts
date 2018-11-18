import * as Koa from "koa";
import { v4 as uuid } from "uuid";
import * as log from "./log";

export function logger(): Koa.Middleware {
  return async (ctx, next) => {
    const t1 = Date.now();
    const id = uuid();
    ctx.response.headers["x-request-id"] = id;
    await next();
    const t2 = Date.now();
    log.info(
      `${ctx.request.method} ${ctx.request.url} status=${
        ctx.response.status
      } requestId=${id} (${t2 - t1}ms)`
    );
  };
}

export function errors(): Koa.Middleware {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      if (ctx.status >= 500) {
        ctx.body = { message: "ServerError" };
        log.exception(
          `server error requestId=${ctx.response.headers["x-request-id"]}`,
          err
        );
      } else if (ctx.status >= 400) {
        ctx.body = {
          message: err.message,
          errors: err.errors
        };
      }
    }
  };
}
