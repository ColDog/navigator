const validate = require("jsonschema").validate;
const db = require("../db");
const { NotFoundError, ValidationError } = require("../errors");

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

async function list() {
  return await db.select("name").from("apps");
}

async function fetch(name) {
  const app = await db
    .select("*")
    .from("apps")
    .where("name", name)
    .first();
  if (!app) {
    throw new NotFoundError("App not found");
  }
  return {
    name: app.name,
    stages: JSON.parse(app.stages)
  };
}

async function insert(app) {
  const result = validate(app || {}, schema);
  if (result.errors.length > 0) {
    throw new ValidationError("App is invalid", result.errors);
  }

  await db.transaction(async tx => {
    const row = await tx
      .select("name")
      .from("apps")
      .where("name", app.name);
    if (row.length > 0) {
      await tx.table("apps").update({ stages: JSON.stringify(app.stages) });
    } else {
      await tx
        .table("apps")
        .insert({ stages: JSON.stringify(app.stages), name: app.name });
    }
  });
}

module.exports = {
  list,
  insert,
  fetch
};
