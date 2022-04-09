const mongoose = require('mongoose')

let schema = mongoose.Schema;

let Product = new schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        base_price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: "upcoming"
        },
        images: {
            type: [],
            required: true
        },
        start_date: {
            type: Date,
            required: true
        },
        end_date: {
            type: Date,
            required: true
        },
        seller_id: {
            type: String,
            required: true
        },
        buyer_id: {
            type: String,
            default: null
        },
        comments: {
            type: [],
            default: []
        },
        bid_history: {
            type: [],
            default: []
        },

    }
)

module.exports = mongoose.model('Product', Product)