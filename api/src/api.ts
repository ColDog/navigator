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
  ctx.body = {
    data: {
      logs: await logs.list(ctx.params.id),
      ...release
    }
  };
});

router.get("/events", async ctx => {
  const data: any = { events: await events.list() };
  if (ctx.query.logs) {
    data.logs = logs.getKey(ctx.query.release);
  }
  ctx.body = { data };
});

router.get("/apps", async ctx => {
  ctx.body = { data: await apps.list() };
});

router.get("/apps/:name", async ctx => {
  ctx.body = { data: await apps.get(ctx.params.name) };
});

router.get("/apps/:name/stages", async ctx => {
  const app = await apps.get(ctx.params.name);
  ctx.body = { data: await appSerializer(app) };
});

router.post("/apps", async ctx => {
  await apps.insert(ctx.request.body as any);
  created(ctx);
});

router.post("/build", async ctx => {
  await builds.insert(ctx.request.body as any);
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
