const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ledgerSchema = new Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:true,
        immutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger must be associated with an transaction"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"]
        },
        required:true,
        immutable:true
    }
})

function preventLedgerModifiaction(){
    throw new Error("Ledger entries are immutable and cannot be modified");
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModifiaction);
ledgerSchema.pre("updateOne",preventLedgerModifiaction);
ledgerSchema.pre("deleteOne",preventLedgerModifiaction);
ledgerSchema.pre("remove",preventLedgerModifiaction);
ledgerSchema.pre("deleteMany",preventLedgerModifiaction);
ledgerSchema.pre("updateMany",preventLedgerModifiaction);
ledgerSchema.pre("findOneAndDelete",preventLedgerModifiaction);
ledgerSchema.pre("findOneAndRepalce",preventLedgerModifiaction);

const ledgerModel = new mongoose.model("ledger",ledgerSchema);

module.exports = ledgerModel;