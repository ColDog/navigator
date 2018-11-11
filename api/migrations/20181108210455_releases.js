exports.up = function(knex) {
  return knex.schema.createTable("releases", function(table) {
    table.string("id").primary();
    table.string("version").notNullable();
    table.string("app").notNullable();
    table.string("stage").notNullable();
    table.string("status").notNullable();
    table.text("results").notNullable();
    table.string("worker");
    table.boolean("removal").notNullable();
    table.timestamp("created").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("releases");
};
