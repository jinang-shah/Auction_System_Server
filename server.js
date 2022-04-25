const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const cors = require('cors')
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose')
const Product = require('./modules/api/routes/product')
const Product_Model = require('./model/product')
const Users = require('./modules/api/routes/user')
const routes = require('./route');
const getUserName = require("./modules/api/utils/queries");
require('dotenv').config()



const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 8000;

mongoose
    .connect(MONGO_URI)
    .then((x) => {
        console.log("connected to MongoDb Success....")
    })
    .catch((err) => {
        console.log("error in connecting to MongoDb");
    })

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.static("/home/priyank/Tranning/angular/company_project/Auction_System_Server/images"))
app.use(express.json())

io.on("connection", (user) => {

  console.log("new user connected")

  user.on("userdata", async(data) => {
    
    console.log("Room : ",data.productId)
    console.log("User : ",data.userId)
    user.id=data.userId;
    user.productId = data.productId
    
    user.join(user.productId)
  });

  user.on("sendComment",async (data) => {

    const productId = data.productId

    commentData = {
      data:data.data,
      timeStamp:data.timeStamp,
      senderId:user.id
    }

    console.log("comment Data :",commentData)

    await Product_Model.findByIdAndUpdate(productId,{
      $push:{comments:commentData}
    }).catch((err)=>{
      console.log("error in uploading comment")
    })
    
    const updatedData = {
      timeStamp:commentData.timeStamp,
      data:commentData.data,
      senderId:{
        name:await getUserName(user.id)
      },
      productId:user.productId
    }

    console.log("updatedData: ",updatedData)

    io.emit('receiveComment',updatedData)
    console.log("done");
  })

  user.on("makeBid",async (data) => {

    const productId = data.productId

    bidData = {
      bidAmount:data.amount,
      timeStamp:data.timeStamp,
      bidderId:user.id,
    }

    console.log("bid Data :",bidData)

    await Product_Model.findByIdAndUpdate(productId,{
      $push:{bidDetails:bidData},
      maxBid:bidData.bidAmount
    }).catch((err)=>{
      console.log("error while updating bid")
    })
    
    const updatedData = {
      timeStamp:bidData.timeStamp,
      amount:bidData.bidAmount,
      bidderId:{
        name:await getUserName(user.id)
      },
      productId:user.productId
    }

    console.log("updated Bid Data: ",updatedData)

    io.emit('receiveBid',updatedData)
    console.log("done");
  })

});

app.use(routes)

server.listen(PORT, () => {
  console.log("Server is running on Port : ", PORT);
});

