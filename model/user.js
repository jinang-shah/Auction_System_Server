const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const schema = mongoose.Schema;

const User = new schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    documents: {
      type: [],
    },
    productBill: {
      type: String,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    buyHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    sellHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    favouriteProdcts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", 
      },
    ],
    notifications: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          times: [
            {
              at: {
                type: Date,
              },
              viewed: {
                type: Boolean,
                default: false,
              },
            },
          ],
        },
      ],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

User.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "dontcomehere");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

module.exports = mongoose.model("Users", User);
