exports.up = function(knex) {
  //"making comments table...");
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable.increments("comment_id").primary();
    commentsTable
      .string("author")
      .notNullable()
      .references("username")
      .inTable("users");
    commentsTable
      .integer("article_id")
      .notNullable()
      .references("article_id")
      .inTable("articles");
    commentsTable
      .integer("votes")
      .notNullable()
      .defaultTo(0);
    commentsTable.timestamp("created_at").defaultTo(knex.fn.now());
    commentsTable.text("body").notNullable();
  });
};

exports.down = function(knex) {
  //"removing comments table...");
  return knex.schema.dropTable("comments");
};
