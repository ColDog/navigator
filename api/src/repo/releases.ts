import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { v4 as uuid } from "uuid";
import { QuerySet } from "./repo";

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
  id?: string;
  app: string;
  stage: string;
  version: string;
  removal?: boolean;
  results?: Results;
  worker?: string;
  status?: string;
  created?: Date;
}

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Application Schema",
  type: "object",
  required: ["app", "stage", "version"],
  properties: {
    app: { type: "string" },
    stage: { type: "string" },
    version: { type: "string" }
  }
};

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
      .orderBy("revision", "DESC")
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
      .orderBy("revision", "DESC")
      .first()
  );
}

export async function insert(release: Release, removal?: boolean) {
  const result = validate(release, schema);
  if (result.errors.length > 0) {
    throw new ValidationError("Release is invalid", result.errors);
  }
  await db.db().transaction(async tx => {
    const row = await tx
      .table("releases")
      .max({ revision: "revision" })
      .first();
    return await tx.table("releases").insert({
      ...release,
      results: "{}",
      removal: removal || false,
      status: "PENDING",
      revision: row.revision + 1 || 1,
      id: uuid()
    });
  });
}

export async function remove(release: Release) {
  return insert(release, true);
}

export async function update(id: string, status: string, results?: Results) {
  return await db
    .table("releases")
    .update({ status, results: JSON.stringify(results) })
    .where("id", id);
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
