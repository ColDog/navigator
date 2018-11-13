import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { v4 as uuid } from "uuid";
import { QuerySet } from "./repo";

const db = new QuerySet(
  (data: any): Build => ({
    ...data,
    values: JSON.parse(data.values)
  })
);

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

export async function last(app: string, stage: string, n: number = 25) {
  return await db.query(t =>
    t
      .select("*")
      .from("builds")
      .where({ app, stage })
      .orderBy("revision", "asc")
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
  await db.db().transaction(async tx => {
    const row = await tx
      .table("builds")
      .max({ revision: "revision" })
      .first();
    return await tx.table("builds").insert({
      ...build,
      revision: row.revision + 1 || 1,
      id: uuid(),
      values: JSON.stringify(build.values || {})
    });
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
  const build = await get(app, stage, version);
  build.stage = to;
  return await insert(build);
}
