import * as releaseRepo from "./repo/releases";
import * as buildRepo from "./repo/builds";
import * as appRepo from "./repo/apps";

export interface Build {
  id: string;
  releaseId: string | null;
  app: string;
  stage: string;
  version: string;
  values: object;
  status: string;
  results: releaseRepo.Results | null;
  released: boolean;
  removed: boolean;
  created: Date;
}

export interface Stage extends appRepo.Stage {
  builds: Build[];
  released: Build | null;
  previous: Build | null;
  current: Build | null;
}

export interface App extends appRepo.App {
  stages: Stage[];
  manifest: appRepo.App;
}

export async function buildSerializer(
  build: buildRepo.Build,
  release?: releaseRepo.Release
): Promise<Build> {
  return {
    id: build.id!,
    releaseId: release ? release.id : null,
    app: build.app,
    stage: build.stage,
    version: build.version,
    values: build.values || {},
    results: release ? release.results : null,
    released: !!release,
    removed: release ? !!release.removal : false,
    status: release ? release.status : "UNRELEASED",
    created: build.created!
  };
}

async function serializeBuild(build?: buildRepo.Build): Promise<Build | null> {
  if (!build) {
    return null;
  }
  let release: releaseRepo.Release | null = null;
  try {
    release = await releaseRepo.getByApp(build.app, build.stage, build.version);
  } catch (e) {
    // Ignore not found errors.
  }
  return buildSerializer(build, release);
}

async function serializeRelease(
  release?: releaseRepo.Release
): Promise<Build | null> {
  if (!release) {
    return null;
  }
  const build = await buildRepo.get(
    release.app,
    release.stage,
    release.version
  );
  return buildSerializer(build, release);
}

export async function appSerializer(app: appRepo.App): Promise<App> {
  return {
    ...app,
    stages: await Promise.all(
      app.stages.map(async stage => await stageSerializer(app, stage))
    ),
    manifest: {
      name: app.name,
      stages: app.stages
    }
  };
}

export async function stageSerializer(
  app: appRepo.App,
  stage: appRepo.Stage
): Promise<Stage> {
  const releases = await releaseRepo.listByStage(app.name, stage.name, 2);
  const builds = await buildRepo.last(app.name, stage.name, 25);
  const released = await serializeRelease(releases[releases.length - 2]);
  const previous = await serializeRelease(releases[releases.length - 1]);
  const current = await serializeBuild(builds[builds.length - 1]);

  return {
    ...stage,
    builds: await Promise.all(builds.map(async b => await serializeBuild(b))),
    released,
    previous,
    current
  };
}
