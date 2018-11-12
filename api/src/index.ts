import * as Koa from "koa";
import parser = require("koa-bodyparser");
import api = require("./api");
import worker = require("./worker");
import { errors, logger } from "./middleware";

const app = new Koa();

app.use(parser());
app.use(errors());
app.use(logger());

app.use(api.router.routes()).use(api.router.allowedMethods());

app.listen(4000);

worker.run();
