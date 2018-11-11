const apps = require("./apps");
const db = require('../db');

beforeEach(async () => {
  await db.migrate.latest();
})

describe("apps", () => {
  it("inserts an app", async () => {
    await apps.insert({ name: "test", stages: [] });
    expect(await apps.fetch("test")).toEqual({
      name: "test",
      stages: []
    });
  });

  it("fails on an invalid app", async () => {
    try {
      await apps.insert({ name: "test", stages: [{}] });
    } catch (e) {
      expect(e.message).toEqual("App is invalid");
    }
  });

  it("lists apps", async () => {
    const data = await apps.list();
    expect(data.find(a => a.name === "test")).toBeTruthy();
  });
});
