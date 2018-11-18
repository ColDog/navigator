import { QuerySet } from "./repo";
import { Upserted } from "../write/apps";
import { subscribe } from "../write";
import * as Knex from "knex";

const db = new QuerySet(
  "App",
  (data: any): App => ({
    ...data,
    stages: JSON.parse(data.stages)
  })
);

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
  chart?: string;
  deploy?: string;
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
    .where("name", app.name);
  if (row.length > 0) {
    await tx.table("apps").update({
      modified: new Date().toISOString(),
      chart: app.chart,
      deploy: app.deploy,
      stages: JSON.stringify(app.stages)
    });
  } else {
    await tx.table("apps").insert({
      stages: JSON.stringify(app.stages),
      chart: app.chart,
      name: app.name,
      deploy: app.deploy,
      modified: new Date().toISOString(),
      created: new Date().toISOString()
    });
  }
}

subscribe("apps.upserted", upsert);
