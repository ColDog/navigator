import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { emit } from "./events";

interface Cluster {
  name: string;
  namespace: string;
  values: object;
}

interface Stage {
  name: string;
  promote?: boolean;
  auto?: boolean;
  review?: boolean;
  clusters: Cluster[];
}

export interface Upserted {
  app: string;
  chart?: string;
  deploy?: string;
  stages: Stage[];
}

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Application Schema",
  type: "object",
  required: ["stages", "name"],
  properties: {
    name: { type: "string" },
    chart: { type: "string" },
    deploy: { type: "string" },
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

export async function insert(app: any) {
  const result = validate(app, schema);
  if (result.errors.length > 0) {
    throw new ValidationError("App is invalid", result.errors);
  }
  const payload: Upserted = { ...app, app: app.name };
  await emit("apps.upserted", payload);
}
