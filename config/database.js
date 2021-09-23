const mongoose = require("mongoose");

const configureDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = configureDB;
