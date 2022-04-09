const express = require('express')
const routes = require('./route')
const mongoose = require('mongoose')
require('dotenv').config()

// const MONGO_URI = process.env.MONGO_URI
// const PORT = process.env.PORT;

const app = express();


PORT = 8000;
// mongoose
//     .connect(MONGO_URI)
//     .then((x) => {
//         console.log("connected to MongoDb Success....")
//     })
//     .catch((err) => {
//         console.log("error in connecting to MongoDb");
//     })


app.use(routes)

app.listen(PORT, () => {
    console.log("Server is running on Port : ", PORT)
})