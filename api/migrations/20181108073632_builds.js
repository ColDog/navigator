exports.up = function(knex) {
  return knex.schema.createTable("builds", function(table) {
    table.increments("id").primary();
    table.string("version").notNullable();
    table.string("app").notNullable();
    table.string("stage").notNullable();
    table.text("values").notNullable();
    table.string("namespace");
    table.unique(["app", "stage", "version"]);
    table.timestamp("created").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("builds");
};
