const articlesRouter = require("express").Router();

const {
  getArticles,
  getArticleById,
  updateArticle
} = require("../controllers/articlesControllers");
const { handle405Errors } = require("../errors/errors");
const {
  getCommentsByArticleId,
  createCommentByArticleId
} = require("../controllers/commentsControllers");

articlesRouter
  .route("/")
  .get(getArticles)
  .all(handle405Errors);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(updateArticle)
  .all(handle405Errors);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(createCommentByArticleId)
  .all(handle405Errors);

module.exports = articlesRouter;
