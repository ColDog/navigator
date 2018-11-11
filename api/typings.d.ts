declare module "koa" {
  interface Request {
    requestId?: string
  }
}
