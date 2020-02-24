exports.handleCustomErorrs = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};
;
exports.handlePsqlErorrs = (err, req, res, next) => {
  if (err.code !== undefined) {
    const psqlErrors = {
      23503: { status: 404, msg: "Not Found" },
      "22P02": { status: 400, msg: "Invalid Input For Integer" },
      "42P01": { status: 404, msg: "Relation does not exist" },
      42702: { status: 404, msg: "Author Is Ambiguous" },
      "42703": { status: 400, msg: "Column Does Not Exist" },
      "23502": { status: 422, msg: "Unprocessable Entity" }
    };
    res
      .status(psqlErrors[err.code].status)
      .send({ msg: psqlErrors[err.code].msg });
  } else next(err);
};

// exports.handlePsqlErorrs = (err, req, res, next) => {
//   if (err.code !== undefined) {
//     const psqlCodes = ["22P02", 23503];

//     if (err.status) res.status(err.status).send({ msg: err.msg });
//     if (psqlCodes.includes(err.code))
//       res.status(400).send({ msg: err.message || "Bad Request" });
//   } else next(err);
// };

exports.handleServerErorrs = (err, req, res, next) => {
  console.log("look here", err);
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.handle405Errors = (req, res, next) => {
  res.status(405).send({ msg: "Method Not Allowed" });
};
