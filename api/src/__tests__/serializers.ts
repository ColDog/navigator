import * as builds from "../repo/builds";
import * as apps from "../repo/apps";
import * as releases from "../repo/releases";
import * as MockDate from "mockdate";
import {
  serializeBuild,
  serializeRelease,
  appSerializer,
} from "../serializers";
import db from "../db";

beforeEach(async () => {
  await db.migrate.latest();
});

const u = { email: "test" };

beforeEach(async () => {
  MockDate.set(new Date(2013, 9, 23));
});

describe("serializers", () => {
  it("serializes a build", async () => {
    await builds.insert(u, { app: "test", version: "v1", stage: "review" });
    const build = await builds.get("test", "review", "v1");
    expect(await serializeBuild(build)).toMatchSnapshot();
  });

  it("serializes a release", async () => {
    await builds.insert(u, { app: "test", version: "v2", stage: "review" });
    await releases.insert(u, { app: "test", version: "v2", stage: "review" });

    const release = await releases.getByApp("test", "review", "v2");
    expect(await serializeRelease(release)).toMatchSnapshot();
  });

  it("serializes an app", async () => {
    await apps.insert(u, {
      name: "test",
      config: {
        chart: "service",
        deploy: "mock-deploy",
      },
      stages: [
        { name: "review", clusters: [{ name: "test", namespace: "default" }] },
      ],
    });
    await builds.insert(u, { app: "test", version: "v3", stage: "review" });
    await releases.insert(u, { app: "test", version: "v3", stage: "review" });

    const app = await apps.get("test");
    expect(await appSerializer(app)).toMatchSnapshot();
  });
});
