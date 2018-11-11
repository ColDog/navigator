import * as Router from "koa-router";
import * as apps from "./repo/apps";
import * as builds from "./repo/builds";
import * as releases from "./repo/releases";
import { appSerializer } from "./serializers";

export const router = new Router({ prefix: "/api/v1" });

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
  await apps.insert(ctx.request.body as any);
  created(ctx);
});

router.post("/build", async ctx => {
  await builds.insert(ctx.request.body as any);
  created(ctx);
});

router.post("/promote", async ctx => {
  await builds.promote(ctx.request.body as any);
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
