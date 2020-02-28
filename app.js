const express = require("express");
const app = express();

const apiRouter = require("./routers/apiRouter");

const {
  handleCustomErorrs,
  handlePsqlErorrs,
  handleServerErorrs,
  handle405Errors
} = require("./errors/errors");
app.use(express.json());

app.use("/api", apiRouter).all(handle405Errors);

// app.use((err, req, res, next) => {
//   if (err) console.log(err);
// });

app.all("/*", (req, res, next) => {
  res.status(404).send("Route Not Found");
});
app.listen(8700);

app.use(handleCustomErorrs);
app.use(handlePsqlErorrs);
app.use(handleServerErorrs);

module.exports = app;
