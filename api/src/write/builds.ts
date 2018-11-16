import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { emit } from "./events";

export interface Created {
  app: string;
  stage: string;
  version: string;
  chart: string;
  values: object;
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

export async function insert(build: any) {
  const result = validate(build || {}, schema, {
    allowUnknownAttributes: false
  });
  if (result.errors.length > 0) {
    throw new ValidationError("Build is invalid", result.errors);
  }
  const payload: Created = { ...build };
  await emit("builds.created", payload);
}

export async function promote(build: any, stage: string) {
  delete build.id;
  build.stage = stage;

  const result = validate(build || {}, schema, {
    allowUnknownAttributes: false
  });
  if (result.errors.length > 0) {
    throw new ValidationError("Build is invalid", result.errors);
  }
  const payload: Created = { ...build };
  await emit("builds.created", payload);
}
