const mongoose = require('mongoose')

const schema = mongoose.Schema;

const User = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: {},
        required: true
    },
    ducuments: {
        type: []
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    buyHistory: {
        type: []
    },
    sellHistory: {
        type: []
    },
    favouriteProdcts: {
        type: []
    },
}, { timestamps: true })

module.exports = mongoose.model('Users', User)