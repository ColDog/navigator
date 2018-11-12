import { v4 as uuid } from "uuid";
import * as apps from './repo/apps'
import * as releases from "./repo/releases";
import * as logs from "./repo/logs";
import * as builds from "./repo/builds";
import { execute, values } from './executor';
import * as log from './log';

export async function doRelease(releaseId: string) {
  const results: releases.Results = {
    stage: '',
    app: '',
    clusters: [],
  };

  try {
    const release = await releases.get(releaseId);
    const build = await builds.get(release.app, release.stage, release.version);
    const app = await apps.get(release.app);
    const stage = app.stages.find(stage => stage.name === release.stage);

    results.stage = build.stage
    results.app = app.name

    if (!stage) {
      await releases.update(release.id, "INVALID_STAGE");
      return;
    }

    await logs.log(releaseId, `starting release "${releaseId}"`);
    await releases.update(release.id, "PENDING", results);

    for (const cluster of stage.clusters) {
      await logs.log(releaseId, `deploying to cluster "${cluster.name}"`);

      try {
        await execute({
          executable: app.deploy || './deployer.sh',
          values: values(build, cluster, release),
          cluster: cluster.name,
          stage: build.stage,
          app: build.app,
          release: releaseId,
          version: build.version,
          namespace: cluster.namespace,
        })
        results.clusters.push({
          name: cluster.name,
          status: "SUCCESS"
        });
      } catch(e) {
        log.exception('cluster release failed', e)
        await logs.log(releaseId, `cluster ${cluster.name} failed: ${e.message}`)
        results.clusters.push({
          name: cluster.name,
          status: "ERRORED"
        });
        throw e
      }

      await releases.update(release.id, "PENDING", results);
    }

    await logs.log(releaseId, "-- release completed --");
    await releases.update(release.id, "SUCCESS", results);
  } catch (e) {
    await logs.log(releaseId, "-- release failed --");
    log.exception('release failed', e)

    try {
      await releases.update(releaseId, "FAILED", results);
    } catch (e) {
      log.exception('release update failed', e)
    }
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
        doRelease(releaseId);
        log.info("release complete", releaseId);
      }
    } catch (e) {
      log.exception('release failed', e);
    }

    await sleep(1000);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
