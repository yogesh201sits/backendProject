const transactionModel = require("../models/transaction.model.js");
const accountModel = require("../models/account.model.js");
const ledgerModel = require("../models/ledger.model.js");
const mongoose = require("mongoose");

async function createTransaction(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;
    if(!fromAccount||!toAccount||!amount||!idempotencyKey){
        res.status(400).json({
            message:"fromAccount & toAccount & amount & ideompotencyKey are required"
        });
    }
    
    //check users
    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount
    });
    
    const toUserAccount = await accountModel.findOne({
        _id:fromAccount
    });

    if(!fromUserAccount||!toUserAccount){
        return res.status(404).json({
            message:"One or both account are not found"
        });
    }

    //check idempotency
    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    });

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status=="COMPLETED"){
            return res.status(200).json({
                message:"Transaction already proceeded",
                transaction:isTransactionAlreadyExists
            });
        }
        if(isTransactionAlreadyExists.status=="PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing",
                transaction:isTransactionAlreadyExists
            });
        }
        if(isTransactionAlreadyExists.status=="FAILED"){
            return res.status(200).json({
                message:"Transaction is failed please retry",
                transaction:isTransactionAlreadyExists
            });
        }
    }
    //check activity
    if(fromAccount.status!=="ACTIVE"||toAccount.status!=="ACTIVE"){
        return res.status(400).json({
            message:"Both from account and to account must be active to proceed transaction"
        })
    }

    //check balance
    const balance = await fromAccount.getBalance();

    if(balance<amount){
        res.status(400).json({
            message:`Insuffcient balance current balance : ${balance} requested : ${amount}`
        })
    }

    try {
        /**
         * 5. Create transaction (PENDING)
         */
        const session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([ {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        } ], { session }))[ 0 ]

        const debitLedgerEntry = await ledgerModel.create([ {
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        } ], { session })

        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
        })()

        const creditLedgerEntry = await ledgerModel.create([ {
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        } ], { session })

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )


        await session.commitTransaction()

        session.endSession()
    } catch (error) {

        return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })

    }

}

module.exports = {createTransaction};