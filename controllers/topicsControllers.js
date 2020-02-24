const { selectTopics } = require('../models/topicsModels');

exports.getTopics = function (req, res, next) {
  selectTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

