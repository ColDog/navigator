const validate = require("jsonschema").validate;
const db = require("../db");
const { ValidationError, NotFoundError } = require("../errors");
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
    values: {
      type: "object",
      additionalProperties: false
    }
  }
};

async function list(app) {
  return await db
    .select("*")
    .from("builds")
    .where("app", app);
}

async function exists(app, stage, version) {
  try {
    await fetch(app, stage, version);
    return true;
  } catch (e) {
    return false;
  }
}

async function find(cb) {
  const data = await cb(db);
  if (!data) {
    throw new NotFoundError("Build does not exist");
  }
  return {
    ...data,
    values: JSON.parse(data.values)
  };
}

async function query(cb) {
  const list = await cb(db);
  return list.map(data => ({
    ...data,
    values: JSON.parse(data.values)
  }));
}

async function fetch(app, stage, version) {
  return find(db =>
    db
      .select("*")
      .from("builds")
      .where({ app, stage, version })
      .first()
  );
}

async function current(app, stage) {
  return find(db =>
    db
      .select("*")
      .from("builds")
      .where({ app, stage })
      .orderBy("createdAt", "desc")
      .first()
  );
}

async function last(app, stage, n) {
  return query(db =>
    db
      .select("*")
      .from("builds")
      .where({ app, stage })
      .orderBy("createdAt", "desc")
      .limit(n)
  );
}

async function insert(build) {
  const buildExists = await exists(build.app, build.stage, build.version);
  if (buildExists) {
    throw new ValidationError("Build already exists");
  }

  const result = validate(build, schema);
  if (result.errors.length > 0) {
    throw new ValidationError("Build is invalid", result.errors);
  }
  return await db.table("builds").insert({
    ...build,
    id: uuid(),
    values: JSON.stringify(build.values || {})
  });
}

async function promote(app, stage, version, to) {
  const build = await fetch(app, stage, version);
  build.stage = to;
  return await insert(build);
}

module.exports = { list, fetch, current, last, insert, promote };
