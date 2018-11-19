import { validate } from "jsonschema";
import { ValidationError } from "../errors";
import { emit } from "./events";

export enum Status {
  Pending = "PENDING",
  Running = "RUNNING",
  Success = "SUCCESS",
  Errored = "ERRORED",
  Invalid = "INVALID",
  Aborted = "ABORTED"
}

export interface Created {
  app: string;
  stage: string;
  version: string;
  removal: boolean;
  status: string;
  canary?: {
    weight: number;
    version: string;
  }
}

export interface Updated {
  id: string;
  app: string;
  stage: string;
  version: string;
  status: string;
  // Cluster is the current cluster that is being worked on.
  cluster?: string;
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
    canary: {
      type: "object",
      properties: {
        weight: { type: "number" },
        version: { type: "string" }
      }
    }
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

export async function update(update: Updated) {
  await emit("releases.updated", update);
}

export async function invalid(releaseId: string) {
  await emit("releases.invalid", { releaseId });
}
