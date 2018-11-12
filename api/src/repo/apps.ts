import { validate } from "jsonschema";
import { v4 as uuid } from "uuid";
import { NotFoundError, ValidationError } from "../errors";
import { QuerySet } from "./repo";

const db = new QuerySet(
  (data: any): App => ({
    ...data,
    stages: JSON.parse(data.stages)
  })
);

export interface Cluster {
  name: string;
  values: object;
}

export interface Stage {
  name: string;
  clusters: Cluster[];
}

export interface App {
  name: string;
  stages: Stage[];
  modified?: Date;
  created?: Date;
}

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Application Schema",
  type: "object",
  required: ["stages", "name"],
  properties: {
    name: { type: "string" },
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
              required: ["name"],
              properties: {
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

export async function insert(app: App) {
  const result = validate(app || {}, schema);
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
        updated: Date.now(),
        stages: JSON.stringify(app.stages)
      });
    } else {
      await tx.table("apps").insert({
        id: uuid(),
        stages: JSON.stringify(app.stages),
        name: app.name
      });
    }
  });
}
