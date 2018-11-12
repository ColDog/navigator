import { sh, execute } from "./executor";
import * as logs from "./repo/logs";
import db from "./db";

beforeEach(async () => {
  await db.migrate.latest();
});

describe("executor", () => {
  it("runs a command", async () => {
    await sh("ls", ["-la"], (line: string) => {
      console.log(line);
    });
  });

  it("executes a deploy", async () => {
    await execute({
      executable: './deployer.sh',
      values: {name: 'test'},
      cluster: 'cluster-name',
      stage: 'stage-name',
      namespace: 'default',
      app: 'app-name',
      release: 'releaseId',
      version: 'build-version',
    })
    console.log(await logs.list('releaseId'));
  })
});
