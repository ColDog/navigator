exports.up = function(knex) {
  return knex.schema.createTable("logs", function(table) {
    table.string("release");
    table.string("line");
    table.timestamp("created").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("logs");
};
