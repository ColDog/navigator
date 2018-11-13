exports.up = function(knex) {
  return knex.schema.createTable("logs", function(table) {
    table.increments("id").primary();
    table.string("release");
    table.string("line");
    table.timestamp("created").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("logs");
};
