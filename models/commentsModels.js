const connection = require("../connection");

exports.selectComments = () => {
  return connection.select("*").from("comments");
};

exports.delComment = id => {
  return connection("comments")
    .where("comment_id", id)
    .del()
    .then(count => {
      if (count === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.selectCommentsByArticleId = (
  sort_by = "created_at",
  order = "desc",

  id
) => {
  // const key = Object.keys(query)[0];
  // const value = Object.values(query)[0];

  const succProm = connection
    .select("*")
    .from("comments")
    .where("comments.article_id", id)
    .orderBy(sort_by, order);

  return Promise.all([succProm, checkArticleExists(id)]).then(rows => {
    const check = rows[1];
    if (check) {
      return succProm;
    } else {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};
exports.postCommentByArticleId = (newComment, id) => {
  const formattedComment = {
    body: newComment.body,
    author: newComment.username,

    article_id: id
  };
  const succProm = connection
    .insert(formattedComment)
    .into("comments")

    .returning("*")
    .then(res => {
      const [postedComment] = res;

      return postedComment;
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

exports.patchComment = (votes = 0, id) => {
  const succProm = connection("comments")
    .where("comment_id", id)
    .increment("votes", votes)
    .returning("*")
    .then(res => {
      return res[0];
    });
  return Promise.all([succProm, checkCommentExists(id)]).then(rows => {
    const check = rows[1];
    if (check) {
      return succProm;
    } else {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};

const checkCommentExists = id => {
  return connection
    .select("*")
    .from("comments")
    .where({ comment_id: id })
    .then(commentRows => {
      if (commentRows.length !== 0) {
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
      if (articlesRows.length !== 0) {
        return true;
      } else {
        return false;
      }
    });
};
