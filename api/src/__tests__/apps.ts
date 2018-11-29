import * as apps from "../repo/apps";

describe("apps", () => {
  it("inserts an app", async () => {
    await apps.insert(
      { email: "test" },
      {
        name: "test",
        stages: [],
        config: {
          chart: "service"
        }
      }
    );
    const out = await apps.get("test");
    expect(out.stages).toEqual([]);
  });

  it("fails on an invalid app", async () => {
    try {
      await apps.insert({ email: "test" }, {
        name: "test",
        stages: [{}]
      } as any);
    } catch (e) {
      expect(e.message).toMatch(/App is invalid/);
    }
  });

  it("lists apps", async () => {
    const data = await apps.list();
    expect(data.find(a => a.name === "test")).toBeTruthy();
  });
});
