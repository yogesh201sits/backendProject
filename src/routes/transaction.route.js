const mongoose = require("mongoose");
const express = require("express");
const {authMiddleware,authSystemUserMiddleware} = require("../middleware/auth.middleware.js")
const {createTransaction,createInitialFundsTransaction} =  require("../controllers/transaction.controller.js")

const router = express.Router();

router.post("/",authMiddleware,createTransaction);

router.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsTransaction)

module.exports = router;