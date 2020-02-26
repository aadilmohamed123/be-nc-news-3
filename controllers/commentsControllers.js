const {
  selectComments,
  delComment,
  selectCommentsByArticleId,
  postCommentByArticleId,
  patchComment
} = require("../models/commentsModels");

exports.getComments = (req, res, next) => {
  selectComments()
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  delComment(comment_id)
    .then(() => {
      res.sendStatus(204);
    })

    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { query } = req;
  const { sort_by } = query;
  const { order } = query;
  selectCommentsByArticleId(sort_by, order, article_id)
    .then(comments => {
      console.log(comments);
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.createCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  postCommentByArticleId(body, article_id)
    .then(postedComment => {
      console.log({ postedComment });
      res.status(201).send({ comment: postedComment });
    })
    .catch(next);
};

exports.updateComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchComment(inc_votes, comment_id)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
