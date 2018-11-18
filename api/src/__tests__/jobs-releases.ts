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
    await apps.insert({
      name: "test",
      chart: "service",
      deploy: "./deployer-mock.sh",
      stages: [
        { name: "review", clusters: [{ name: "test", namespace: "default" }] }
      ]
    });
    await builds.insert({ app: "test", version: "v3", stage: "review" });
    await releases.insert({ app: "test", version: "v3", stage: "review" });
    const id = await releases.pop("worker-id");
    await worker.doRelease(id);

    const logList = await logs.list(id);
    expect(logList[logList.length - 1].line).toEqual("-- release completed --");
  });
});
