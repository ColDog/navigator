import { sh, execute } from "./executor";
import * as logs from "./repo/logs";
import db from "./db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("executor", () => {
  it("runs a command", async () => {
    const lines: string[] = [];
    await sh("ls", ["-la"], async (line: string) => {
      lines.push(line);
    });
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });

  it("executes a deploy", async () => {
    await execute({
      executable: "echo",
      values: { name: "test" },
      cluster: "cluster-name",
      chart: "test",
      stage: "stage-name",
      namespace: "default",
      app: "app-name",
      release: "releaseId",
      version: "build-version",
      remove: false,
    });
    const lines = await logs.list("releaseId");
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });
});
