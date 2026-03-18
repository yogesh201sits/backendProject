const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:[true,"Account must be associated with user"],
        index:true,
        unique:[true,"user already exists"]
    },
    status:{
        type:String,
        enum:{
            values:["ACTIVE","FROZEN","COLSED"],
            message:"status can be active frozen or closed"
        },
        default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true,"currency is required"],
        default:"INR"
    }
},{timestamps:true});

accountSchema.index({user:1,status:1});

const accountModel = new mongoose.model("account",accountSchema);

module.exports = accountModel;