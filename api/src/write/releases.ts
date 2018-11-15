import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { emit } from "./events";

export interface Created {
  app: string;
  stage: string;
  version: string;
  removal: boolean;
  status: string;
}

export interface WriteResults {
  stage: string;
  app: string;
  clusters: Array<{
    name: string;
    status: string;
  }>;
}

export interface Updated {
  id: string;
  app: string;
  status: string;
  results: WriteResults;
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

export async function insert(release: any, removal?: boolean) {
  const result = validate(release, schema);
  if (result.errors.length > 0) {
    throw new ValidationError("Release is invalid", result.errors);
  }
  const payload: Created = {
    ...release,
    removal: removal || false,
    status: "PENDING"
  };
  await emit("releases.created", payload);
}

export async function remove(release: any) {
  await insert(release, true);
}

export async function update(
  id: string,
  status: string,
  results: WriteResults
) {
  const payload: Updated = { id, status, results, app: results.app };
  await emit("releases.updated", payload);
}
