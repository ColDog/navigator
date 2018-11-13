exports.up = function(knex) {
  return knex.schema.createTable("apps", function(table) {
    table.increments("id").primary();
    table.string("name").unique();
    table.string("chart").notNullable();
    table.text("stages").notNullable();
    table.timestamp("modified").notNullable();
    table.timestamp("created").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("apps");
};
