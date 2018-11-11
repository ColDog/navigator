import { validate } from "jsonschema";
import db from "../db";
import { ValidationError, NotFoundError } from "../errors";
import { v4 as uuid } from "uuid";

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
  const data = await db
    .select("*")
    .from("releases")
    .where("id", id)
    .first();
  return load(data);
}

export async function listByStage(
  app: string,
  stage: string,
  n: number = 25
): Promise<Release[]> {
  return await db
    .select("*")
    .from("releases")
    .where({ app, stage })
    .orderBy("created", "asc")
    .limit(n)
    .map(load);
}

export async function listByApp(
  app: string,
  stage: string,
  version: string,
  n: number = 25
) {
  return await db
    .select("*")
    .from("releases")
    .where({ app, stage, version })
    .orderBy("created", "desc")
    .limit(n)
    .map(load);
}

export async function insert(release: Release, removal?: boolean) {
  const result = validate(release, schema);
  if (result.errors.length > 0) {
    throw new ValidationError("Release is invalid", result.errors);
  }
  return await db.table("releases").insert({
    ...release,
    results: "{}",
    removal: removal || false,
    status: "PENDING",
    id: uuid()
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
  await db.transaction(async tx => {
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

function load(data: any) {
  return {
    ...data,
    results: JSON.parse(data.results),
    removal: !!data.removal
  };
}
