const { selectUsers, selectUserByUsername } = require("../models/usersModels");

exports.getUsers = function(req, res, next) {
  selectUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = function(req, res, next) {
  const { username } = req.params;
  selectUserByUsername(username)
    .then(user => 
      res.status(200).send({ user }))
    .catch(next);
};
