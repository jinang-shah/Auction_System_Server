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
            type: String,
          },
          when: [
            {
              at: {
                type: Date,
                required: true,
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
  },
  { timestamps: true }
);

User.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET_KEY
  );
  return token;
};

module.exports = mongoose.model("Users", User);
