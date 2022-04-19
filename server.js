const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const cors = require('cors')
const mongoose = require('mongoose')
const Product = require('./modules/api/routes/product')
const Users = require('./modules/api/routes/user')
const routes = require('./route')
require('dotenv').config()


// const MONGO_URI = process.env.MONGO_URI
const MONGO_URI = "mongodb+srv://admin123:InpaPNEXVJ5sOtlw@cluster0.opxsk.mongodb.net/Auction_System?retryWrites=true&w=majority"
// const app = express();
const PORT = process.env.PORT || 8000;

mongoose
    .connect(MONGO_URI)
    .then((x) => {
        console.log("connected to MongoDb Success....")
    })
    .catch((err) => {
        console.log("error in connecting to MongoDb");
    })

app.use(cors())
app.use(express.json())

io.on("connection", socket => {
    console.log("new User connected")
    io.emit("hello","world how are you")
});


app.get('/', (req, res) => {
    res.send("Home Page")
})

app.use(routes)


server.listen(PORT, () => {
    console.log("Server is running on Port : ", PORT)
})