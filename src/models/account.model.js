const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ledger = require("./ledger.model.js");
const ledgerModel = require("./ledger.model.js");

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

accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([
        {
            $match: { account: this._id }
        },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ["$totalCredit", "$totalDebit"]
                }
            }
        }
    ]);

    // Handle empty case
    if (balanceData.length === 0) return 0;

    return balanceData[0].balance;
};

const accountModel = new mongoose.model("account",accountSchema);

module.exports = accountModel;