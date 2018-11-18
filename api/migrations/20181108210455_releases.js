exports.up = function(knex) {
  return knex.schema.createTable("releases", function(table) {
    table.increments("id").primary();
    table.string("version").notNullable();
    table.string("app").notNullable();
    table.string("stage").notNullable();
    table.string("status").notNullable();
    table.string("canary");
    table.string("worker");
    table
      .boolean("removal")
      .notNullable()
      .defaultTo(false);
    table.timestamp("modified").notNullable();
    table.timestamp("created").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("releases");
};
