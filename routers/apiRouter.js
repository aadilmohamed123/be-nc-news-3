const apiRouter = require("express").Router();

const topicsRouter = require("./topicsRouter");
const usersRouter = require("./usersRouter");
const articlesRouter = require("./articlesRouter");
const commentsRouter = require("./commentsRouter.js");
const allEndpoints = require("../endpoints.json");
const {handle405Errors} = require("../errors/errors");

apiRouter
  .route("/")
  .get((req, res, next) => {
    res.status(200).send({ allEndpoints });
  })
  .all(handle405Errors);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
