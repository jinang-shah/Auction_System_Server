const mongoose = require("mongoose");

let schema = mongoose.Schema;
let Product = new schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "upcoming",
  },
  images: {
    type: [],
    required: true,
  },
  bill:{
    type :[],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  maxBid:{
    type:Number,
    default:0,
  },
  comments: {
    type: [
      {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      data: {
        type: String,
      },
      timeStamp: {
        type: Date,
        default: Date.now,
      },
    },
    ],
    default: [],
  },
  bidDetails: [
    {
      bidderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      bidAmount: {
        type: Number,
      },
      timeStamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
},{timestamps:true});

module.exports = mongoose.model("Product", Product);
