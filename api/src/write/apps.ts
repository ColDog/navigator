import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { emit } from "./events";

export interface Upserted {
  app: string;
  config: object;
  stages: object[];
}

export const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Application Schema",
  type: "object",
  required: ["stages", "name", "config"],
  properties: {
    name: { type: "string" },
    config: {
      type: "object",
      properties: {
        chart: {
          type: "string",
          description: "Chart url to download a helm chart from"
        },
        deploy: {
          type: "string",
          description: "Script used for the deployment"
        },
        values: {
          type: "object",
          properties: {
            image: {
              type: "boolean",
              description:
                "Insert the version as the image.tag field, a common use case"
            },
            template: {
              type: "string",
              description:
                "Evaluate a template to provide the values for the deployment"
            }
          }
        },
        rollback: {
          type: "object",
          properties: {
            onFailure: { type: "boolean" }
          }
        }
      }
    },
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
