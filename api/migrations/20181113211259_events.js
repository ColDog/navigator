exports.up = function(knex) {
  return knex.schema.createTable("events", function(table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("app");
    table.string("subject");
    table.text("payload").notNullable();
    table.timestamp("created").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("events");
};
