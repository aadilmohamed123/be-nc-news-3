const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");

const {
  handleCustomErorrs,
  handlePsqlErorrs,
  handleServerErorrs
} = require("./errors/errors");
app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err) console.log(err);
});

app.all("/*", (req, res, next) => {
  res.status(405).send("Route Not Found");
});
app.listen(8090);

app.use(handleCustomErorrs);
app.use(handlePsqlErorrs);
app.use(handleServerErorrs);

module.exports = app;
