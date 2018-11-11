const releases = require("./repo/releases");
const apps = require("./repo/apps");
const db = require("./db");
const worker = require('./worker')

beforeEach(async () => {
  await db.migrate.latest();
});

describe("worker", () => {
  it("pops a release", async () => {
    await apps.insert({ name: "test", stages: [] });
    await releases.insert({ app: "test", version: "v3", stage: "review" });
    const id = await releases.pop("worker-id");
    await worker.doRelease(id);
  });
});
