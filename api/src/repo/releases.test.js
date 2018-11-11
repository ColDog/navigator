const releases = require("./releases");
const db = require("../db");

beforeEach(async () => {
  await db.migrate.latest();
});

describe("releases", () => {
  it("inserts a release", async () => {
    await releases.insert({ app: "test", version: "v1", stage: "review" });
    const list = await releases.listByApp("test", "review", "v1");
    const rel = list[0];
    expect(rel.status).toEqual("PENDING");
    expect(rel.removal).toEqual(false);
  });

  it("inserts a removal release", async () => {
    await releases.remove({ app: "test", version: "v1", stage: "review" });
    const list = await releases.listByApp("test", "review", "v1");
    const rel = list[list.length - 1];
    expect(rel.status).toEqual("PENDING");
    expect(rel.removal).toEqual(true);
  });

  it("pops a release", async () => {
    await releases.insert({ app: "test", version: "v2", stage: "review" });
    const id = await releases.pop("worker-id");
    expect(id).toBeTruthy();
    const rel = await releases.get(id);
    expect(rel.worker).toEqual("worker-id");

    releases.update(id, 'WORKING', {});

    const rel2 = await releases.get(id);
    expect(rel2.status).toEqual("WORKING");
  });
});
