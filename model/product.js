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
    ref:"Users",
    required:true,
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Users"
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
        ref:"Users"
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
        type: String,
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
});

module.exports = mongoose.model("Product", Product);
