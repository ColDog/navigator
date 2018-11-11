const Router = require("koa-router");
const apps = require("./repo/apps");
const builds = require("./repo/builds");
const releases = require("./repo/releases");
const { appSerializer } = require("./serializers");

const router = new Router({ prefix: "/api/v1" });

router.get("/", async ctx => {
  ctx.body = {
    routes: ["/apps", "/apps/:name", "/build", "/promote", "/release"]
  };
});

router.get("/apps", async ctx => {
  ctx.body = { data: await apps.list() };
});

router.get("/apps/:name", async ctx => {
  ctx.body = { data: await apps.fetch(ctx.params.name) };
});

router.get("/apps/:name/stages", async ctx => {
  const app = await apps.fetch(ctx.params.name);
  ctx.body = { data: await appSerializer(app) };
});

router.post("/apps", async ctx => {
  await apps.insert(ctx.request.body);
  created(ctx);
});

router.post("/build", async ctx => {
  await builds.insert(ctx.request.body);
  created(ctx);
});

router.post("/promote", async ctx => {
  await builds.promote(ctx.request.body);
  created(ctx);
});

router.post("/release", async ctx => {
  await releases.insert(ctx.request.body);
  created(ctx);
});

router.delete("/release", async ctx => {
  await releases.remove(ctx.request.body);
  created(ctx);
});

function created(ctx) {
  ctx.body = { status: "created", requestId: ctx.requestId };
}

module.exports = { router };
