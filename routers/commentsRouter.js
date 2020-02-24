const commentsRouter = require("express").Router();
const {
  getComments,
  removeComment,
  updateComment
} = require("../controllers/commentsControllers");
const { handle405Errors } = require("../errors/errors");

commentsRouter
  .route("/")
  .get(getComments)
  .all(handle405Errors);
commentsRouter
  .route("/:comment_id")
  .delete(removeComment)
  .patch(updateComment)
  .all(handle405Errors);

module.exports = commentsRouter;
