const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername
} = require("../controllers/usersControllers");
const { handle405Errors } = require("../errors/errors");


usersRouter
  .route("/")
  .get(getUsers)
  .all(handle405Errors);
usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405Errors);

module.exports = usersRouter;
