import * as Koa from "koa";
import * as serve from "koa-static";
import * as send from "koa-send";
import * as path from "path";

/**
 * Server runs a file server for all urls at /static/* at staticPath and returns
 * index.html otherwise.
 *
 * @param staticPath
 */
export function server(staticPath: string) {
  const indexFile = path.join(staticPath, "index.html");
  const staticMiddleware = serve(staticPath);
  const indexMiddleware: Koa.Middleware = async (
    ctx: Koa.Context,
    next: () => Promise<any>,
  ) => {
    await next();

    if (ctx.method !== "HEAD" && ctx.method !== "GET") return;

    // Response is already handled.
    if (ctx.body != null || ctx.status !== 404) return;

    try {
      await send(ctx as any, indexFile);
    } catch (err) {
      if (err.status !== 404) throw err;
    }
  };

  return async (ctx: Koa.Context, next: () => Promise<any>) => {
    if (ctx.path.startsWith("/static")) {
      await staticMiddleware(ctx as any, next);
      return;
    }
    await indexMiddleware(ctx, next);
  };
}
