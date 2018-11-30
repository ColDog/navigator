import * as builds from "../repo/builds";
import db from "../db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("builds", () => {
  it("inserts a build", async () => {
    await builds.insert(
      { email: "test" },
      { app: "test", version: "v1", stage: "review" },
    );
    const list = await builds.listUnreleased("test", "review");
    expect(list.length).toBeGreaterThanOrEqual(0);
  });
});
