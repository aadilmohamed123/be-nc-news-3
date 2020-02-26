const {
  selectArticles,
  selectArticleById,
  patchArticle
} = require("../models/articlesModels");

exports.getArticles = function(req, res, next) {
  const { query } = req;
  const { sort_by } = query;
  const { order } = query;
  selectArticles(sort_by, order, query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = function(req, res, next) {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => res.status(200).send({ article }))
    .catch(next);
};

exports.updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticle(inc_votes, article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
