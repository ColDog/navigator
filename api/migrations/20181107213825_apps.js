exports.up = function(knex) {
  return knex.schema.createTable("apps", function(table) {
    table.string("name").primary();
    table.string("chart").notNullable();
    table.string("id").notNullable();
    table.text("stages").notNullable();
    table.timestamp("updated").defaultTo(knex.fn.now());
    table.timestamp("created").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("apps");
};
