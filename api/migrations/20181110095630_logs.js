exports.up = function(knex) {
  return knex.schema.createTable("logs", function(table) {
    table.string("releaseId");
    table.string("line");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("logs");
};
