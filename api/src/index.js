const Koa = require("koa");
const BodyParser = require("koa-bodyparser");
const api = require("./api");
const worker = require("./worker");
const { errors, logger } = require("./middleware");

const app = new Koa();

app.use(BodyParser());
app.use(errors());
app.use(logger());

app.use(api.router.routes()).use(api.router.allowedMethods());

app.listen(4000);

worker.run();
