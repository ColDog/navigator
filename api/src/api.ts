import * as Router from "koa-router";
import * as apps from "./repo/apps";
import * as builds from "./repo/builds";
import * as logs from "./repo/logs";
import * as releases from "./repo/releases";
import * as events from "./repo/events";
import { auth, AuthMixin, LoggerMixin } from "./middleware";
import { appSerializer } from "./serializers";

export const router = new Router({ prefix: "/api/v1" });

router.use(auth());

/**
 * Context includes all of the added values from middleware and auth.
 */
interface Context extends Router.IRouterContext, AuthMixin, LoggerMixin {}

router.get("/logs/:id", async (ctx: Context) => {
  const release = await releases.get(ctx.params.id);
  const log = await logs.list(ctx.params.id);
  ctx.body = {
    key: log[log.length - 1] ? log[log.length - 1].id : "_",
    done: release.status !== "PENDING" && !!release.status,
    data: { ...release, logs: log }
  };
});

router.get("/apps", async (ctx: Context) => {
  ctx.body = { data: await apps.list() };
});

router.get("/apps/:name", async (ctx: Context) => {
  ctx.body = { data: await apps.get(ctx.params.name) };
});

router.get("/apps/:name/stages", async (ctx: Context) => {
  const eventList = await events.listByApp(ctx.params.name);
  const key = eventList[0] ? eventList[0].id : "_";
  if (ctx.query.key) {
    ctx.body = { key };
    return;
  }
  const data = await appSerializer(await apps.get(ctx.params.name));
  ctx.body = { key, data: { ...data, events: eventList } };
});

router.post("/apps", async (ctx: Context) => {
  await apps.insert(ctx.user, ctx.request.body as any);
  created(ctx);
});

router.post("/build", async (ctx: Context) => {
  await builds.insert(ctx.user, ctx.request.body as any);
  created(ctx);
});

router.post("/promote", async (ctx: Context) => {
  const { app, stage, version, to } = ctx.request.body as any;
  const build = await builds.get(app, stage, version);
  await builds.promote(ctx.user, build, to);
  created(ctx);
});

router.post("/release", async (ctx: Context) => {
  await releases.insert(ctx.user, ctx.request.body as any);
  created(ctx);
});

router.post("/rollback", async (ctx: Context) => {
  const { app, stage } = ctx.request.body as any;
  const previous = await releases.previous(app, stage); // Will throw NotFound.
  await releases.insert(ctx.user, { app, stage, version: previous.version });
  created(ctx);
});

router.delete("/release", async (ctx: Context) => {
  await releases.remove(ctx.request.body as any);
  created(ctx);
});

function created(ctx: any) {
  ctx.body = { status: "created", requestId: ctx.requestId };
}
