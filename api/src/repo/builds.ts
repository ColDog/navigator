import { validate } from "jsonschema";
import db from "../db";
import { ValidationError, NotFoundError } from "../errors";
import { v4 as uuid } from "uuid";
import * as knex from "knex";

export interface Build {
  id?: string;
  app: string;
  stage: string;
  version: string;
  values?: object;
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
    version: { type: "string" },
    values: {
      type: "object",
      additionalProperties: false
    }
  }
};

export async function list(app: string): Promise<Build[]> {
  return await db
    .select("*")
    .from("builds")
    .where("app", app)
    .map(load);
}

export async function exists(
  app: string,
  stage: string,
  version: string
): Promise<boolean> {
  try {
    await fetch(app, stage, version);
    return true;
  } catch (e) {
    return false;
  }
}

export async function find(
  cb: (db: knex) => knex.QueryBuilder
): Promise<Build> {
  const data = await cb(db);
  if (!data) {
    throw new NotFoundError("Build does not exist");
  }
  return load(data);
}

export async function query(
  cb: (db: knex) => knex.QueryBuilder
): Promise<Build[]> {
  return await cb(db).map(load);
}

export async function fetch(app: string, stage: string, version: string) {
  return find(db =>
    db
      .select("*")
      .from("builds")
      .where({ app, stage, version })
      .first()
  );
}

export async function current(app: string, stage: string) {
  return find(db =>
    db
      .select("*")
      .from("builds")
      .where({ app, stage })
      .orderBy("createdAt", "desc")
      .first()
  );
}

export async function last(app: string, stage: string, n: number = 25) {
  return query(db =>
    db
      .select("*")
      .from("builds")
      .where({ app, stage })
      .orderBy("createdAt", "desc")
      .limit(n)
  );
}

export async function insert(build: Build) {
  const buildExists = await exists(build.app, build.stage, build.version);
  if (buildExists) {
    throw new ValidationError("Build already exists");
  }

  const result = validate(build, schema);
  if (result.errors.length > 0) {
    throw new ValidationError("Build is invalid", result.errors);
  }
  return await db.table("builds").insert({
    ...build,
    id: uuid(),
    values: JSON.stringify(build.values || {})
  });
}

export async function promote({
  app,
  stage,
  version,
  to
}: {
  app: string;
  stage: string;
  version: string;
  to: string;
}) {
  const build = await fetch(app, stage, version);
  build.stage = to;
  return await insert(build);
}

function load(data: any): Build {
  return {
    ...data,
    values: JSON.parse(data.values)
  };
}
