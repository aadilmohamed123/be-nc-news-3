exports.up = function(knex) {
  //"creating users table...");
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .unique();
    usersTable.string("avatar_url").notNullable();
    usersTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  //"removing users table...");
  return knex.schema.dropTable("users");
};
