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
    required:true
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
    type: String,
    default: false
  },
  buyerId: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  comments: {
    type: [],
    default: [],
  },
  bidDetails: [
    {
      userId: {
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
},{timestamps:true});

module.exports = mongoose.model("Product", Product);
