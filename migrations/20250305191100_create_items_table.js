exports.up = function (knex) {
  return knex.schema.createTable("items", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.integer("price").notNullable();
    table.timestamp("created_date").defaultTo(knex.fn.now());
    table.timestamp("deleted_date").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("items");
};
