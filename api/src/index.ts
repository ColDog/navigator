import * as Koa from "koa";
import parser = require("koa-bodyparser");
import api = require("./api");
import { errors, logger } from "./middleware";
import * as autoJob from "./jobs/auto";
import * as releaseJob from "./jobs/release";

const app = new Koa();

app.use(parser());
app.use(errors());
app.use(logger());

app.use(api.router.routes()).use(api.router.allowedMethods());

app.listen(4000);

releaseJob.run();
autoJob.run();
