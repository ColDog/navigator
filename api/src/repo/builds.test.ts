import * as builds from "./builds";
import db from "../db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("builds", () => {
  it("inserts a build", async () => {
    await builds.insert({ app: "test", version: "v1", stage: "review" });
  });
});
