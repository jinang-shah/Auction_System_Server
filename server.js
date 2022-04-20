const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./route");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8000;

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

io.on("connection", (socket) => {
  console.log("new User connected");
  io.emit("hello", "world how are you");
});

app.use(routes);

app.use("/", (req, res) => {
  res.send({ msg: "route handler not set" });
});

server.listen(PORT, () => {
  console.log("Server is running on Port : ", PORT);
});
