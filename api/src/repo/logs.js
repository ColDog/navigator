const db = require("../db");

async function log(releaseId, line) {
  await db.insert({ releaseId, line }).into("logs");
}

async function list(releaseId) {
  return await db
    .select(["line", "createdAt"])
    .from("logs")
    .where("releaseId", releaseId)
    .orderBy("createdAt", "desc");
}

module.exports = { list, log };
