const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics").insert(topicData);
      const usersInsertions = knex("users").insert(userData);

      return Promise.all([topicsInsertions, usersInsertions])
        .then(([insertedTopicData, insertedUserData]) => {
          const datesChanged = formatDates(articleData);
          return knex("articles")
            .insert(datesChanged)
            .returning("*");
        })
        .then(articleRows => {
          const articleRef = makeRefObj(articleRows);

          const formattedComments = formatComments(commentData, articleRef);
          return knex("comments").insert(formattedComments);
        });
    })
    .catch(err => {
      //err);
    });
};
