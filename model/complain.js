const mongoose = require("mongoose");

let schema = mongoose.Schema;

let Complain = new schema(
  {
    buyerId: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    complainDetails: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    image: {
      type: [],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complain", Complain);
