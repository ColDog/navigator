import * as Koa from "koa";
import * as config from "./config";
import * as jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errors";
import * as crypto from "crypto";

export interface User {
  email: string;
}

type AuthFunc = (ctx: Koa.Context) => User | undefined;

function uaEmail(ctx: Koa.Context): string {
  const ua = ctx.request.header["user-agent"].split("/")[0];
  return `${ua}@navigator.io`;
}

function disabledAuth(ctx: Koa.Context): User | undefined {
  if (config.auth.disabled) {
    return { email: uaEmail(ctx) };
  }
}

function apiAuth(ctx: Koa.Context): User | undefined {
  if (!config.auth.api.enabled) {
    return;
  }

  const auth = ctx.request.header["authorization"];
  if (!auth) {
    return;
  }

  const key = auth.split(" ")[1];

  if (key && cmp(key, config.auth.api.key)) {
    return { email: uaEmail(ctx) };
  }
}

function proxyAuth(ctx: Koa.Context): User | undefined {
  if (!config.auth.proxy.enabled) {
    return;
  }

  const email = ctx.request.header[config.auth.proxy.header];
  if (email) {
    return { email };
  }
}

function jwtAuth(ctx: Koa.Context): User | undefined {
  const auth = ctx.request.header["authorization"];
  if (!auth) {
    return;
  }

  if (!config.auth.jwt.enabled || !config.auth.jwt.secret) {
    return;
  }

  const key = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(key, config.auth.jwt.secret);
    if (typeof decoded === "object") {
      const email = (decoded as any).email;
      if (email) {
        return { email };
      }
    }
  } catch (e) {}
}

const handlers: AuthFunc[] = [apiAuth, proxyAuth, jwtAuth, disabledAuth];

function runAuth(ctx: Koa.Context): boolean {
  for (const handler of handlers) {
    const user = handler(ctx);
    if (user) {
      (ctx as any).user = user;
      return true;
    }
  }
  return false;
}

/**
 * Auth middleware, uses configuration from the config.auth package to run
 * through a set of authenticators to see if any match.
 */
export function auth(): Koa.Middleware {
  return async (ctx, next) => {
    if (!runAuth(ctx)) {
      throw new UnauthorizedError(`Unauthorized`);
    }
    await next();
  };
}

function cmp(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(new Buffer(a), new Buffer(b));
}
