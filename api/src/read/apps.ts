import { Deploy } from "../executor";
import * as _ from "lodash";
import { QuerySet } from "./repo";
import { Upserted } from "../write/apps";
import { subscribe } from "../write";
import * as Knex from "knex";
import { Build } from "./builds";
import { Release } from "./releases";

const db = new QuerySet<App>({
  name: "App",
  created: true,
  modified: true,
  serialize: ["stages", "config"]
});

export interface Config {
  chart?: string;
  deploy?: string;
  values?: {
    image?: boolean;
    template?: string;
  };
  rollback?: {
    onFailure?: boolean;
  };
}

export interface Cluster {
  name: string;
  namespace: string;
  values: object;
}

export interface Stage {
  name: string;
  promote?: boolean;
  auto?: boolean;
  review?: boolean;
  clusters: Cluster[];
}

export interface App {
  id: string;
  name: string;
  config: Config;
  stages: Stage[];
  modified: string;
  created: string;
}

export async function list(): Promise<Array<{ id: string; name: string }>> {
  return await db.table("apps").select(["id", "name"]);
}

export async function get(name: string): Promise<App> {
  return await db.find(t =>
    t
      .select("*")
      .from("apps")
      .where("name", name)
      .first()
  );
}

async function upsert(tx: Knex.Transaction, app: Upserted) {
  const row = await tx
    .select("name")
    .from("apps")
    .where("name", app.app);
  if (row.length > 0) {
    await db.update(tx.table("apps").where("name", app.app), {
      stages: app.stages,
      config: app.config || {}
    });
  } else {
    await db.create(tx.table("apps"), {
      stages: app.stages,
      name: app.app,
      config: app.config || {}
    });
  }
}

subscribe("apps.upserted", upsert);

export function values(
  app: App,
  build: Build,
  cluster: Cluster,
  release: Release
) {
  const canary = release.canary && {
    enabled: true,
    tag: release.canary.version,
    weight: release.canary.weight
  };
  const image = _.get(app, "config.values.image", undefined) && {
    ..._.get(cluster, "values.image", {}),
    ..._.get(build, "values.image", {}),
    tag: build.version
  };
  return {
    ...cluster.values,
    ...build.values,
    image,
    canary,
    version: build.version
  };
}

export function deploy(
  app: App,
  build: Build,
  cluster: Cluster,
  release: Release
): Deploy {
  return {
    executable: app.config.deploy || "./bin/deployer",
    values: values(app, build, cluster, release),
    cluster: cluster.name,
    stage: build.stage,
    app: build.app,
    chart: build.chart || app.config.chart,
    release: release.id,
    version: build.version,
    remove: !!release.removal,
    namespace: build.namespace || cluster.namespace
  };
}
