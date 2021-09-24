const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3030;
const path = require("path");

const configure = require("./config/database");
const router = require("./config/routes");

require("dotenv").config();
configure();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "coupon-code-validator-fe/build")));

app.use("/v1", router);

//* Handles any requests that don't match the ones above
app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname + "/coupon-code-validator-fe/build/index.html")
  );
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
