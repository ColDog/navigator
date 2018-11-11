exports.up = function(knex) {
  return knex.schema.createTable("builds", function(table) {
    table.string("id").primary();
    table.string("version").notNullable();
    table.string("app").notNullable();
    table.string("stage").notNullable();
    table.text("values").notNullable();
    table.unique(["app", "stage", "version"]);
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("builds");
};
