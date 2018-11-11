exports.up = function(knex) {
  return knex.schema.createTable("apps", function(table) {
    table.string("name").primary();
    table.text("stages").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("apps");
};
