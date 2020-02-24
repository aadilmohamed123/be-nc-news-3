const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topicsControllers");
const { handle405Errors } = require("../errors/errors");


topicsRouter
  .route("/")
  .get(getTopics)
  .all(handle405Errors);

module.exports = topicsRouter;
