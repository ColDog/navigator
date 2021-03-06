import * as Koa from "koa";
import * as parser from "koa-bodyparser";
import * as api from "./api";
import { server } from "./static";
import { errors, logger } from "./middleware";
import * as autoJob from "./jobs/auto";
import * as releaseJob from "./jobs/release";
import * as log from "./log";
import * as config from "./config";
import db from "./db";

export const app = new Koa();

app.use(parser());
app.use(errors());
app.use(logger());
app.use(server("public"));

app.use(api.router.routes()).use(api.router.allowedMethods());

// Ensure that the program will crash on unhandled rejections.
process.on('unhandledRejection', err => { throw err; });

async function main() {
  log.info("migrating database");
  await db.migrate.latest();

  log.info("starting app on port", config.port);
  const srv = app.listen(config.port);

  log.info("starting workers");
  releaseJob.run();
  autoJob.run();

  async function shutdown() {
    log.warn("starting shutdown...");

    srv.close();
    log.warn("server stopped");

    await db.destroy();
    log.warn("database closed");

    process.exit(0);
  }

  // Will throw an error and crash the program if the DB connection is not
  // verified at this point.
  const res = await db.select(db.raw("1 AS hello"));
  log.info("db connection verified", res);

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

if (require.main === module) main();
