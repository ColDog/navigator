import * as releases from "../repo/releases";
import db from "../db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("releases", () => {
  it("inserts a release", async () => {
    await releases.insert({ app: "test", version: "v1", stage: "review" });
    const rel = await releases.getByApp("test", "review", "v1");
    expect(rel.status).toEqual("PENDING");
    expect(rel.removal).toEqual(false);
  });

  it("inserts a removal release", async () => {
    await releases.insert({ app: "test", version: "v3", stage: "review" });
    await releases.remove({ app: "test", version: "v3", stage: "review" });
    const rel = await releases.getByApp("test", "review", "v3");
    expect(rel.status).toEqual("PENDING");
    expect(rel.removal).toEqual(true);
  });

  it("pops a release", async () => {
    await releases.insert({ app: "test", version: "v2", stage: "review" });
    const id = await releases.pop("worker-id");
    expect(id).toBeTruthy();
    const rel = await releases.get(id);
    expect(rel.worker).toEqual("worker-id");

    releases.update({
      id,
      status: releases.Status.Pending,
      stage: rel.stage,
      app: rel.app,
      version: rel.version,
      cluster: null
    });

    const rel2 = await releases.get(id);
    expect(rel2.status).toEqual("WORKING");
  });
});
