import * as releaseRepo from "./repo/releases";
import * as buildRepo from "./repo/builds";
import * as appRepo from "./repo/apps";

export async function appSerializer(app: appRepo.App) {
  return {
    ...app,
    stages: await Promise.all(
      app.stages.map(async stage => await stageSerializer(app, stage))
    ),
    manifest: {
      name: app.name,
      stages: app.stages,
    }
  };
}

export async function stageSerializer(app: appRepo.App, stage: appRepo.Stage) {
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
