const connection = require("../connection");

exports.selectArticles = (sort_by = "created_at", order = "desc", query) => {
  const key = Object.keys(query)[0];
  const value = Object.values(query)[0];

  const withAuthor = queryBuilder => {
    if (query.author !== undefined) {
      queryBuilder.where(`articles.${key}`, value);
    }
  };
  const withTopic = queryBuilder => {
    if (query.topic !== undefined) {
      queryBuilder.where(`articles.${key}`, value);
    }
  };

  const succProm = connection
    .select("articles.*")
    .from("articles")
    .orderBy(sort_by, order)
    .modify(withAuthor)
    .modify(withTopic)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id");

  return succProm.then(rows => {
    if (rows.length === 0) {
      return Promise.all([
        checkUserExists(query.author),
        checkTopicExists(query.topic)
      ]).then(emptyRows => {
        if (
          query.author !== undefined &&
          query.topic === undefined &&
          emptyRows[0] === false
        ) {
          return Promise.reject({
            status: 404,
            msg: "Not Found"
          });
        } else if (
          query.topic !== undefined &&
          query.author === undefined &&
          emptyRows[1] === false
        ) {
          return Promise.reject({
            status: 404,
            msg: "Not Found"
          });
        } else {
          return [];
        }
      });
    } else {
      return rows;
    }
  });
};

exports.selectArticleById = id => {
  const succProm = connection
    .select("articles.*")
    .from("articles")
    .where("articles.article_id ", id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .then(array => {
      return array[0];
    });
  return Promise.all([succProm, checkArticleExists(id)]).then(rows => {
    const check = rows[1];
    if (check) {
      return succProm;
    } else {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};

exports.patchArticle = (votes = 0, id) => {
  const succProm = connection("articles")
    .where("article_id", id)
    .increment("votes", votes)
    .returning("*")
    .then(res => {
      return res[0];
    });
  return Promise.all([succProm, checkArticleExists(id)]).then(rows => {
    const check = rows[1];
    if (check) {
      return succProm;
    } else {
      return false;
    }
  });
};

const checkUserExists = author => {
  if (author === undefined) {
    return false;
  } else {
    return connection
      .select("*")
      .from("users")
      .where("username", author)
      .then(rows => {
        if (rows.length !== 0) {
          return true;
        } else {
          return false;
        }
      });
  }
};

const checkTopicExists = topic => {
  if (topic === undefined) {
    return false;
  } else {
    return connection
      .select("*")
      .from("topics")
      .where("slug", topic)
      .then(rows => {
        if (rows.length !== 0) {
          return true;
        } else {
          return Promise.reject({
            status: 404,
            msg: "Not Found"
          });
        }
      });
  }
};
const checkArticleExists = id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id: id })
    .then(articlesRows => {
      if (articlesRows.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
};
