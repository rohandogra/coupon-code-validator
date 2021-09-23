const express = require("express");
const app = express();
const cors = require("cors");
const port = 3030;
const configure = require("./config/database");
const router = require("./config/routes");

require("dotenv").config();
configure();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/v1", router);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
