import { QuerySet } from "./repo";
import { subscribe } from "../write";
import * as Knex from "knex";
import { Created, Updated, Status } from "../write/releases";
import { NotFoundError } from "../errors";

const db = new QuerySet<Release>({
  name: "Release",
  created: true,
  modified: true,
  serialize: ["canary"],
  booleans: ["removal"]
});

export interface Release {
  id: string;
  app: string;
  stage: string;
  version: string;
  canary?: {
    weight: number;
    version: string;
  };
  removal: boolean;
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

export async function previous(app: string, stage: string): Promise<Release> {
  const list = await listByStage(app, stage, 2);
  if (list.length !== 2) {
    throw new NotFoundError(`Previous release not found ${app}/${stage}`);
  }
  return list[1]; // Preceding release.
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
  await db.create(tx.table("releases"), release);
}

async function update(tx: Knex.Transaction, release: Updated) {
  await db.update(tx.table("releases").where("id", release.id), {
    status: release.status
  });
}

async function invalid(tx: Knex.Transaction, payload: { releaseId: string }) {
  await db.update(tx.table("releases").where("id", payload.releaseId), {
    status: Status.Invalid
  });
}

subscribe("releases.created", insert);
subscribe("releases.updated", update);
subscribe("releases.invalid", invalid);
