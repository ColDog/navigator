const uuid = require("uuid/v4");
const apps = require("./repo/apps");
const releases = require("./repo/releases");
const logs = require("./repo/logs");

async function doRelease(releaseId) {
  try {
    const release = await releases.get(releaseId);
    const app = await apps.fetch(release.app);
    const stage = app.stages.find(stage => stage.name === release.stage);

    if (!stage) {
      await releases.update(release.id, "INVALID_STAGE");
      return;
    }

    await logs.log(releaseId, `starting release "${releaseId}"`);

    const results = {
      stage: stage.name,
      app: app.name,
      clusters: []
    };
    await releases.update(release.id, "PENDING", results);

    for (const cluster of stage.clusters) {
      await logs.log(releaseId, `deploying to cluster "${cluster.name}"`);
      results.clusters.push({
        name: cluster.name,
        status: "SUCCESS"
      });
      await releases.update(release.id, "PENDING", results);
    }

    await logs.log(releaseId, "-- release completed --");
    await releases.update(release.id, "SUCCESS", results);
  } catch (e) {
    await logs.log(releaseId, "-- release failed --");
    console.log("release worker failed");
    console.error(e);

    try {
      await releases.update(releaseId, "FAILED");
    } catch (e) {
      console.log("release worker failed update");
      console.error(e);
    }
  }
}

async function run() {
  const id = uuid();
  console.log("starting worker", id);
  while (true) {
    try {
      const releaseId = await releases.pop(id);
      if (releaseId) {
        console.log("release starting", releaseId);
        doRelease(releaseId);
        console.log("release complete", releaseId);
      }
    } catch (e) {
      console.error(e);
    }

    await sleep(1000);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { run, doRelease };
