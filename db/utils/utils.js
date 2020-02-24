function timeConverter(timestamp) {
  const a = new Date(timestamp);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = a.getDate();
  const hour = a.getHours();
  const min = a.getMinutes();
  const sec = a.getSeconds();
  const time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return a;
}

exports.formatDates = dates => {
  return [
    ...dates.map(
      date =>
        (date = { ...date, created_at: timeConverter(date["created_at"]) })
    )
  ];
};

exports.makeRefObj = articles => {
  const refObj = {};
  articles.forEach(article => (refObj[article.title] = article.article_id));
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return [
    ...comments.map(comment => {
      const newComment = { ...comment };
      newComment.author = comment.created_by;
      newComment.article_id = articleRef[comment.belongs_to];
      newComment.created_at = timeConverter(comment.created_at);
      delete newComment.created_by;
      delete newComment.belongs_to;
      return newComment;
    })
  ];
};
