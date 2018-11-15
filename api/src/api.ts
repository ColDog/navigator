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
    data: {
      ...release,
      logs: log,
      done: release.status !== "PENDING" && !!release.status,
      key: log[0] ? log[0].id : "_"
    }
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
  const app = await appSerializer(await apps.get(ctx.params.name));
  ctx.body = {
    data: {
      ...app,
      key: eventList[0] ? eventList[0].id : "_",
      events: eventList
    }
  };
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
