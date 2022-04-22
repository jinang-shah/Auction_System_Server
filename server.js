const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const cors = require("cors");
const cookieParser = require("cookie-parser");
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

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static("/home/priyank/Tranning/angular/company_project/Auction_System_Server/images"))

io.on("connection", (socket) => {
    console.log("new User connected");
    io.emit("hello", "world how are you");
});

app.use(routes);

server.listen(PORT, () => {
    console.log("Server is running on Port : ", PORT);
});