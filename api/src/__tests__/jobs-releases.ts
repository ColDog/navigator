import * as apps from "../repo/apps";
import * as builds from "../repo/builds";
import * as releases from "../repo/releases";
import * as worker from "../jobs/release";
import * as logs from "../repo/logs";
import db from "../db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("jobs/releases", () => {
  it("does a release", async () => {
    const u = { email: "test" };
    await apps.insert(u, {
      name: "test",
      config: {
        chart: "service",
        deploy: "./deployer-mock.sh"
      },
      stages: [
        { name: "review", clusters: [{ name: "test", namespace: "default" }] }
      ]
    });
    await builds.insert(u, { app: "test", version: "v3", stage: "review" });
    await releases.insert(u, { app: "test", version: "v3", stage: "review" });
    const id = await releases.pop("worker-id");
    await worker.doRelease(id!);

    const logList = await logs.list(id!);
    expect(logList[logList.length - 1].line).toEqual("-- release completed --");
  });
});
