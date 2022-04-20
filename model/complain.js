const mongoose = require("mongoose");

let schema = mongoose.Schema;

let Complain = new schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  complainDetails: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  image: {
    type: [],
    default: [],
  },
});

module.exports = mongoose.model("Complain", Complain);
