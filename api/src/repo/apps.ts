import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { QuerySet } from "./repo";
import * as crypto from "crypto";
import _ = require("lodash");

const db = new QuerySet(
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

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Application Schema",
  type: "object",
  required: ["stages", "name"],
  properties: {
    name: { type: "string" },
    chart: { type: "string" },
    stages: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "clusters"],
        properties: {
          name: { type: "string" },
          review: { type: "boolean" },
          promote: { type: "boolean" },
          auto: { type: "boolean" },
          clusters: {
            type: "array",
            items: {
              type: "object",
              required: ["name", "namespace"],
              properties: {
                namespace: { type: "string" },
                name: { type: "string" },
                values: { type: "object" }
              }
            }
          }
        }
      }
    }
  }
};

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

export async function getKey(name: string): Promise<string> {
  const app = await db
    .table("apps")
    .select({ key: "modified" })
    .where("name", name)
    .first();
  const release = await db
    .table("releases")
    .max({ key: "modified" })
    .where("app", name)
    .first();
  const build = await db
    .table("builds")
    .max({ key: "id" })
    .where("app", name)
    .first();

  const md5 = crypto.createHash("md5");
  md5.update(`${_.get(build, "key", "-")}`);
  md5.update(`${_.get(app, "key", "-")}`);
  md5.update(`${_.get(release, "key", "-")}`);
  return md5.digest("hex");
}

export async function insert(app: any) {
  const result = validate(app || {}, schema, { allowUnknownAttributes: false });
  if (result.errors.length > 0) {
    throw new ValidationError("App is invalid", result.errors);
  }

  await db.db().transaction(async tx => {
    const row = await tx
      .select("name")
      .from("apps")
      .where("name", app.name);
    if (row.length > 0) {
      await tx.table("apps").update({
        modified: new Date().toISOString(),
        chart: app.chart,
        stages: JSON.stringify(app.stages)
      });
    } else {
      await tx.table("apps").insert({
        stages: JSON.stringify(app.stages),
        chart: app.chart,
        name: app.name,
        modified: new Date().toISOString(),
        created: new Date().toISOString()
      });
    }
  });
}
