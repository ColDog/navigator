import * as Router from "koa-router";
import * as apps from "./repo/apps";
import * as builds from "./repo/builds";
import * as logs from "./repo/logs";
import * as releases from "./repo/releases";
import * as events from "./repo/events";
import { appSerializer } from "./serializers";

export const router = new Router({ prefix: "/api/v1" });

router.get("/logs/:id", async ctx => {
  const release = await releases.get(ctx.params.id);
  const log = await logs.list(ctx.params.id);
  ctx.body = {
    key: log[log.length - 1] ? log[log.length - 1].id : "_",
    done: release.status !== "PENDING" && !!release.status,
    data: { ...release, logs: log }
  };
});

router.get("/apps", async ctx => {
  ctx.body = { data: await apps.list() };
});

router.get("/apps/:name", async ctx => {
  ctx.body = { data: await apps.get(ctx.params.name) };
});

router.get("/apps/:name/stages", async ctx => {
  const eventList = await events.listByApp(ctx.params.name);
  const key = eventList[0] ? eventList[0].id : "_";
  if (ctx.query.key) {
    ctx.body = { key };
    return;
  }
  const data = await appSerializer(await apps.get(ctx.params.name));
  ctx.body = { key, data: { ...data, events: eventList } };
});

router.post("/apps", async ctx => {
  await apps.insert(ctx.request.body as any);
  created(ctx);
});

router.post("/build", async ctx => {
  await builds.insert(ctx.request.body as any);
  created(ctx);
});

router.post("/promote", async ctx => {
  const { app, stage, version, to } = ctx.request.body as any;
  const build = await builds.get(app, stage, version);
  await builds.promote(build, to);
  created(ctx);
});

router.post("/release", async ctx => {
  await releases.insert(ctx.request.body as any);
  created(ctx);
});

router.delete("/release", async ctx => {
  await releases.remove(ctx.request.body as any);
  created(ctx);
});

function created(ctx: any) {
  ctx.body = { status: "created", requestId: ctx.requestId };
}
