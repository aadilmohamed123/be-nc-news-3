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
  query,
  id
) => {
  // const key = Object.keys(query)[0];
  // const value = Object.values(query)[0];

  const succProm = connection
    .select("*")
    .from("comments")
    .orderBy(sort_by, order)
    .where("article_id", id);

  return Promise.all([succProm, checkArticleExists(id)]).then(rows => {
    const check = rows[1];
    if (check) {
      console.log(succProm);
      return succProm;
    } else {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
  });
};
exports.postCommentByArticleId = (newComment, id) => {
  console.log(newComment);
  const formattedComment = {
    body: newComment.body,
    author: newComment.created_by,
    votes: newComment.votes,
    article_id: id
  };
  const succProm = connection
    .insert(formattedComment)
    .into("comments")

    .returning("*")
    .then(res => {
      console.log(res);
      const postedComment = {
        comment_id: res[0].comment_id,
        created_at: res[0].created_at,

        body: res[0].body,
        author: res[0].author,
        votes: res[0].votes
      };
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
      return Promise.reject({ status: 422, msg: "Not Found" });
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
