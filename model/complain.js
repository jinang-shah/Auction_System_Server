const mongoose = require("mongoose");

let schema = mongoose.Schema;

let Complain = new schema({
    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    },
    complainDetails:{
        type:String,
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    images:{
        type:[],
        default:[],
    },
    date:{
        type: Date,
        default: Date.now,
    },
    isSolved:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Complain',Complain)

