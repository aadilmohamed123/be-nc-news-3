const connection = require("../connection");

const selectUsers = () => {
  return connection.select("*").from("users");
};

const selectUserByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username })
    .then(array => {
      if (array.length === 0)
        return Promise.reject({ status: 404, msg: "Not Found" });
        
      else {
        return array[0];
      }
    });
};

module.exports = { selectUsers, selectUserByUsername };
