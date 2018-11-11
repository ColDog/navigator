const builds = require("./builds");
const db = require("../db");

beforeEach(async () => {
  await db.migrate.latest();
});

describe("builds", () => {
  it("inserts a build", async () => {
    await builds.insert({ app: "test", version: "v1", stage: "review" });
  });
});
