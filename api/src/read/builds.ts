import { QuerySet } from "./repo";
import { subscribe } from "../write";
import * as Knex from "knex";
import { Created } from "../write/builds";

const db = new QuerySet<Build>({
  name: "Build",
  created: true,
  serialize: ["values"]
});

export interface Build {
  id: string;
  app: string;
  stage: string;
  version: string;
  chart?: string;
  namespace?: string;
  values?: object;
  created: string;
}

export async function list(app: string): Promise<Build[]> {
  return await db.query(t =>
    t
      .select("*")
      .from("builds")
      .where("app", app)
  );
}

export async function listUnreleased(
  app: string,
  stage: string
): Promise<Build[]> {
  return await db.query(t =>
    t
      .select("builds.*")
      .from("builds")
      .where("builds.app", app)
      .where("builds.stage", stage)
      .whereNull("releases.id")
      .leftJoin("releases", function() {
        this.on("builds.version", "=", "releases.version")
          .andOn("builds.stage", "=", "releases.stage")
          .andOn("builds.app", "=", "releases.app");
      })
  );
}

export async function exists(app: string, stage: string, version: string) {
  return await db.exists(t =>
    t
      .select("id")
      .from("builds")
      .where({ app, stage, version })
      .first()
  );
}

export async function get(app: string, stage: string, version: string) {
  return await db.find(t =>
    t
      .select("*")
      .from("builds")
      .where({ app, stage, version })
      .first()
  );
}

export async function latest(
  app: string,
  stage: string
): Promise<Build | undefined> {
  const bs = await db.query(t =>
    t
      .select("*")
      .from("builds")
      .where({ app, stage })
      .orderBy("id", "desc")
  );
  return bs[0];
}

export async function lastByNamespace(
  app: string,
  stage: string,
  n: number = 25
): Promise<Build[]> {
  const builds = await last(app, stage, n);
  const namespaces = builds
    .map(b => b.namespace)
    .filter((ns, i, s) => s.indexOf(ns) === i); // Unique namespaces.
  const byNamespace = namespaces
    .map(ns => builds.find(b => b.namespace === ns))
    .filter(b => b);
  return byNamespace as Build[];
}

export async function last(app: string, stage: string, n: number = 25) {
  return await db.query(t =>
    t
      .select("*")
      .from("builds")
      .where({ app, stage })
      .orderBy("id", "desc")
      .limit(n)
  );
}

async function insert(tx: Knex.Transaction, build: Created) {
  await db.create(tx.table("builds"), build);
}

subscribe("builds.created", insert);
