const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./route");
require("dotenv").config();

// const MONGO_URI = process.env.MONGO_URI
const MONGO_URI = process.env.MONGO_URI;
const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log("connected to MongoDb Success....");
  })
  .catch((err) => {
    console.log("error in connecting to MongoDb");
  });

app.use(cors());
app.use(express.json());

app.use(router);

app.use("/", (req, res) => {
  res.send({ msg: "route handler not set" });
});

app.listen(PORT, () => {
  console.log("Server is running on Port : ", PORT);
});
