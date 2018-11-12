import * as apps from "./repo/apps";
import * as builds from "./repo/builds";
import * as releases from "./repo/releases";
import * as worker from "./worker";
import db from "./db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("worker", () => {
  it("pops a release", async () => {
    await apps.insert({ name: "test", stages: [] });
    await builds.insert({ app: "test", version: "v3", stage: "review" });
    await releases.insert({ app: "test", version: "v3", stage: "review" });
    const id = await releases.pop("worker-id");
    await worker.doRelease(id);
  });
});
