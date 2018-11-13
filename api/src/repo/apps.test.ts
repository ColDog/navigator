import * as apps from "./apps";
import db from "../db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("apps", () => {
  it("inserts an app", async () => {
    await apps.insert({ name: "test", chart: "service", stages: [] });
    const out = await apps.get("test");
    expect(out.stages).toEqual([]);
  });

  it("fails on an invalid app", async () => {
    try {
      await apps.insert({ name: "test", stages: [{}] } as any);
    } catch (e) {
      expect(e.message).toEqual("App is invalid");
    }
  });

  it("lists apps", async () => {
    const data = await apps.list();
    expect(data.find(a => a.name === "test")).toBeTruthy();
  });
});
