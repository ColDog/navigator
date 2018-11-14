import { QuerySet } from "../repo/repo";
import { subscribe } from "../write";
import * as Knex from "knex";
import { Created, Updated } from "../write/releases";

const db = new QuerySet(
  (data: any): Release => ({
    ...data,
    results: JSON.parse(data.results),
    removal: !!data.removal
  })
);

export interface Results {
  stage: string;
  app: string;
  clusters: Array<{
    name: string;
    status: string;
  }>;
}

export interface Release {
  id: string;
  app: string;
  stage: string;
  version: string;
  removal: boolean;
  results?: Results;
  worker?: string;
  status?: string;
  modified: string;
  created: string;
}

export async function get(id: string): Promise<Release> {
  return await db.find(t =>
    t
      .select("*")
      .from("releases")
      .where({ id })
      .first()
  );
}

export async function listByStage(
  app: string,
  stage: string,
  n: number = 25
): Promise<Release[]> {
  return await db.query(t =>
    t
      .select("*")
      .from("releases")
      .where({ app, stage })
      .orderBy("id", "DESC")
      .limit(n)
  );
}

export async function getByApp(
  app: string,
  stage: string,
  version: string
): Promise<Release> {
  return await db.find(t =>
    t
      .select("*")
      .from("releases")
      .where({ app, stage, version })
      .orderBy("id", "DESC")
      .first()
  );
}

export async function pop(worker: string) {
  let releaseId;
  await db.db().transaction(async tx => {
    const row = await tx
      .select("id")
      .from("releases")
      .where("worker", null)
      .first();
    if (row) {
      releaseId = row.id;
      await tx
        .table("releases")
        .update({ worker })
        .where("id", releaseId);
    }
  });
  return releaseId;
}

async function insert(tx: Knex.Transaction, release: Created) {
  await tx.table("releases").insert({
    ...release,
    modified: new Date().toISOString(),
    created: new Date().toISOString()
  });
}

async function update(tx: Knex.Transaction, release: Updated) {
  await tx
    .table("releases")
    .update({
      ...release,
      results: JSON.stringify(release.results),
      modified: new Date().toISOString()
    })
    .where("id", release.id);
}

subscribe("releases.created", insert);
subscribe("releases.updated", update);
