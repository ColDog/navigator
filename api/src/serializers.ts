import * as releaseRepo from "./read/releases";
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
  released: boolean;
  removed: boolean;
  namespace: string | null;
  created: string;
  canary?: {
    weight: number;
    version: string;
  };
}

export interface Stage extends appRepo.Stage {
  builds: Build[];
  released: Build | null;
  previous: Build | null;
  current: Build | null;
}

export interface App extends appRepo.App {
  stages: Stage[];
  manifest: {
    name: string;
    chart: string;
    deploy: string;
    stages: appRepo.Stage[];
  };
}

async function buildSerializer(
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
    released: !!release,
    removed: release ? !!release.removal : false,
    status: release ? release.status : "UNRELEASED",
    namespace: build.namespace || null,
    created: build.created!,
    canary: release && release.canary
  };
}

export async function serializeBuild(
  build?: buildRepo.Build
): Promise<Build | null> {
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

export async function serializeRelease(
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
      deploy: app.deploy,
      stages: app.stages,
      chart: app.chart
    }
  };
}

export async function stageSerializer(
  app: appRepo.App,
  stage: appRepo.Stage
): Promise<Stage> {
  const releases = await releaseRepo.listByStage(app.name, stage.name, 2);
  const builds = stage.review
    ? await buildRepo.lastByNamespace(app.name, stage.name, 50)
    : await buildRepo.last(app.name, stage.name, 50);
  const released = await serializeRelease(releases[0]); // Latest release.
  const previous = await serializeRelease(releases[1]); // Preceding release.
  const current = await serializeBuild(
    await buildRepo.latest(app.name, stage.name)
  );

  return {
    ...stage,
    builds: await Promise.all(builds.map(async b => await serializeBuild(b))),
    released,
    previous,
    current
  };
}
