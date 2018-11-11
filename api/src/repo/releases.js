const validate = require("jsonschema").validate;
const db = require("../db");
const ValidationError = require("../errors").ValidationError;
const uuid = require("uuid/v4");

const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  description: "Application Schema",
  type: "object",
  required: ["app", "stage", "version"],
  properties: {
    app: { type: "string" },
    stage: { type: "string" },
    version: { type: "string" },
  }
};

async function get(id) {
  const data = await db
    .select("*")
    .from("releases")
    .where("id", id)
    .first();
  return load(data);
}

async function listByStage(app, stage, n) {
  const data = await db
    .select("*")
    .from("releases")
    .where({ app, stage })
    .orderBy("createdAt", "asc")
    .limit(n);
  return data.map(data => load(data));
}

async function listByApp(app, stage, version, n=25) {
  const data = await db
    .select("*")
    .from("releases")
    .where({ app, stage, version })
    .orderBy("createdAt", "asc")
    .limit(n);
  return data.map(data => load(data));
}

async function insert(release, removal) {
  const result = validate(release, schema);
  if (result.errors.length > 0) {
    throw new ValidationError("Release is invalid", result.errors);
  }
  return await db.table("releases").insert({
    ...release,
    results: "{}",
    removal: removal || false,
    status: "PENDING",
    id: uuid()
  });
}

async function remove(release) {
  return insert(release, true);
}

async function update(id, status, results) {
  return await db
    .table("releases")
    .update({ status, results: JSON.stringify(results) })
    .where("id", id);
}

async function pop(worker) {
  let releaseId;
  await db.transaction(async tx => {
    const row = await tx
      .select("id")
      .from("releases")
      .where("worker", null)
      .first();
    if (row) {
      releaseId = row.id;
      await tx
        .table("releases")
        .update({ worker })
        .where("id", releaseId);
    }
  });
  return releaseId;
}

function load(data) {
  return {
    ...data,
    results: JSON.parse(data.results),
    removal: !!data.removal
  };
}

module.exports = { get, listByApp, listByStage, insert, update, remove, pop };
