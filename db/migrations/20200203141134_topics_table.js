exports.up = function(knex) {
  //"creating topics table...");
  return knex.schema.createTable("topics", topicsTable => {
    topicsTable
      .string("slug")
      .notNullable()
      .primary()
      .unique();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  //"removing topics table...");
  return knex.schema.dropTable("topics");
};
