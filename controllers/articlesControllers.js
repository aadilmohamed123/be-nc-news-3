const {
  selectArticles,
  selectArticleById,
  patchArticle
} = require("../models/articlesModels");

exports.getArticles = function(req, res, next) {
  const { query } = req;
  const { sort_by } = query;
  const { order } = query;
  console.log(query, "query");
  selectArticles(sort_by, order, query)
    .then(articles => {
      // console.log(articles, "then block");
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
  console.log(req.body);
  patchArticle(inc_votes, article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};
