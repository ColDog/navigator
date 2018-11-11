const releaseRepo = require("./repo/releases");
const buildRepo = require("./repo/builds");

async function appSerializer(app) {
  return {
    ...app,
    stages: await Promise.all(
      app.stages.map(async stage => await stageSerializer(app, stage))
    )
  };
}

async function stageSerializer(app, stage) {
  const releases = await releaseRepo.listByStage(app.name, stage.name, 25);
  const builds = await buildRepo.last(app.name, stage.name, 25);
  const released = releases[releases.length - 1] || null;
  const previous = releases[releases.length - 2] || null;
  const current = builds[builds.length - 1] || null;

  return {
    ...stage,
    builds,
    releases,
    released,
    previous,
    current
  };
}

module.exports = { appSerializer, stageSerializer };
