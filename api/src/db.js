const config = require("./config");
const db = require("knex")(config.database[config.environment]);

module.exports = db;
