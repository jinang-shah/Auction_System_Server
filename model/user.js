const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const schema = mongoose.Schema;

const User = new schema({
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
        minlength: 6,
        // select: false,
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
    buyHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }, ],
    sellHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }, ],
    favouriteProdcts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }, ],
    notifications: {
        type: [{
            productId: {
                type: String,
            },
            when: {
                type: String,
            },
        }, ],
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }, ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, { timestamps: true });
User.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

User.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, "dontcomehere");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};

module.exports = mongoose.model("Users", User);