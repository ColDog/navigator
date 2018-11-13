import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { QuerySet } from "./repo";

const db = new QuerySet(
  (data: any): Build => ({
    ...data,
    values: JSON.parse(data.values)
  })
);

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

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Application Schema",
  type: "object",
  required: ["app", "stage", "version"],
  properties: {
    app: { type: "string" },
    stage: { type: "string" },
    version: { type: "string" },
    chart: { type: "string" },
    values: {
      type: "object",
      additionalProperties: true
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
) {
  const builds = await last(app, stage, n);
  const namespaces = builds
    .map(b => b.namespace)
    .filter((ns, i, s) => s.indexOf(ns) === i); // Unique namespaces.
  const byNamespace = namespaces
    .map(ns => builds.find(b => b.namespace === ns))
    .filter(b => b);
  return byNamespace;
}

export async function last(app: string, stage: string, n: number = 25) {
  return await db.query(t =>
    t
      .select("*")
      .from("builds")
      .where({ app, stage })
      .orderBy("id", "asc")
      .limit(n)
  );
}

export async function insert(build: any) {
  const result = validate(build || {}, schema, {
    allowUnknownAttributes: false
  });
  if (result.errors.length > 0) {
    throw new ValidationError("Build is invalid", result.errors);
  }
  const buildExists = await exists(build.app, build.stage, build.version);
  if (buildExists) {
    throw new ValidationError("Build already exists");
  }
  return await db.table("builds").insert({
    ...build,
    values: JSON.stringify(build.values || {}),
    created: new Date().toISOString()
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
  delete build.id;
  return await insert(build);
}
