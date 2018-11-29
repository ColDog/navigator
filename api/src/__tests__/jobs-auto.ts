import * as builds from "../repo/builds";
import * as apps from "../repo/apps";
import * as releases from "../repo/releases";
import * as worker from "../jobs/auto";
import { NotFoundError } from "../errors";

describe("jobs/auto", () => {
  it("triggers a release", async () => {
    await apps.insert(
      { email: "test" },
      {
        name: "test",
        config: {
          chart: "service",
          deploy: "nav-mock-deploy"
        },
        stages: [
          {
            name: "review",
            auto: true,
            clusters: [{ name: "test", namespace: "default" }]
          }
        ]
      }
    );
    await builds.insert(
      { email: "test" },
      { app: "test", version: "v3", stage: "review" }
    );

    let err;
    try {
      await releases.getByApp("test", "review", "v3");
    } catch (e) {
      err = e;
    }
    expect(err).toBeInstanceOf(NotFoundError);

    await worker.scanApps();
    await releases.getByApp("test", "review", "v3"); // No error.
  });
});
