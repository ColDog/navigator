import { v4 as uuid } from "uuid";
import * as apps from "../repo/apps";
import * as releases from "../repo/releases";
import * as logs from "../repo/logs";
import * as builds from "../repo/builds";
import { execute } from "../executor";
import * as log from "../log";

export async function doRelease(releaseId: string) {
  const release = await releases.get(releaseId);
  const app = await apps.get(release.app);
  const build = await builds.get(release.app, release.stage, release.version);
  const stage = app.stages.find(s => s.name === release.stage);
  if (!stage) {
    throw new Error(`Stage not found "${build.stage}"`);
  }

  const update = (status: string, cluster?: string) => {
    const rel: releases.Updated = {
      id: releaseId,
      status: releases.Status.Pending,
      stage: build.stage,
      app: app.name,
      version: build.version,
      cluster: undefined
    };
    releases.update(
      { email: "releaser@navigator.io" },
      { ...rel, status, cluster }
    );
  };

  try {
    await logs.log(releaseId, `starting release "${releaseId}"`);
    await update(releases.Status.Pending);

    for (const cluster of stage.clusters) {
      await logs.log(releaseId, `deploying to cluster "${cluster.name}"`);
      await update(releases.Status.Running, cluster.name);

      try {
        await execute(apps.deploy(app, build, cluster, release));
      } catch (e) {
        log.exception("cluster release failed", e);
        await logs.log(
          releaseId,
          `cluster ${cluster.name} failed: "${e.message}"`
        );

        await update(releases.Status.Errored, cluster.name);
        throw e;
      }
    }

    await logs.log(releaseId, "-- release completed --");
    await update(releases.Status.Success);
  } catch (e) {
    log.exception("release failed", e);
    await logs.log(releaseId, "-- release failed --");
    await update(releases.Status.Errored);

    // TODO: If configured, rollback if the release failed to deploy.
  }
}

export async function run() {
  const id = uuid();
  log.info("starting worker", id);
  while (true) {
    try {
      const releaseId = await releases.pop(id);
      if (releaseId) {
        log.info("release starting", releaseId);
        try {
          doRelease(releaseId);
        } catch (e) {
          log.exception("unexpected release error", e);
          releases.invalid({ email: "releaser@navigator.io" }, releaseId);
        }
        log.info("release complete", releaseId);
      }
    } catch (e) {
      log.exception("release worker failed", e);
    }

    await sleep(1000);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
