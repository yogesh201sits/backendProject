const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true
    },
    status:{
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"]
        },
        default:"PENDING"
    },
    idempotencyKey:{
        type:String,
        required:true,
        index:true,
        unique:true
    }
},{timestamps:true});

const transactionModel = new mongoose.model("transaction",transactionSchema);
