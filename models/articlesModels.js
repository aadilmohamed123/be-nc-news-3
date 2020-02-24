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
      queryBuilder.where(key, value);
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

  return Promise.all([
    succProm,
    checkTopicExists(query.topic),
    checkUserExists(query.author)
  ]).then(rows => {
    if (
      (query.topic !== undefined && rows[1]) ||
      (query.author !== undefined && rows[2]) ||
      query.topic === undefined ||
      query.author === undefined
    ) {
      return rows[0];
    } else {
      return Promise.reject({ status: 404, msg: "Not Found" });
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

exports.patchArticle = (votes, id) => {
  const succProm = connection("articles")
    .where("article_id", id)
    .increment("votes", votes)
    .returning("*")
    .then(res => {
      // console.log(res);
      return res[0];
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

const checkUserExists = author => {
  return connection
    .select("*")
    .from("users")
    .where("username", author)
    .then(rows => {
      console.log(rows.length);
      if (rows.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
};

const checkTopicExists = topic => {
  return connection
    .select("*")
    .from("topics")
    .where("slug", topic)
    .then(rows => {
      console.log(rows.length);
      if (rows.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
};
const checkArticleExists = id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id: id })
    .then(articlesRows => {
      console.log(articlesRows.length);
      if (articlesRows.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
};
