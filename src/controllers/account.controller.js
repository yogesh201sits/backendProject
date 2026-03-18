const accountModel = require("../models/account.model.js");

async function createAccountController(req,res){
    const user = req.user;
    // console.log(user)
    const account = await accountModel.create({
        user:user._id
    })
    // console.log(account)
    res.status(201).json({
        account:account
    });
}

module.exports = {createAccountController}