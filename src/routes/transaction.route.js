const mongoose = require("mongoose");
const {authMiddleware} = require("../middleware/auth.middleware.js")
const {createTransaction} =  require("../controllers/transaction.controller.js")

const router = mongoose.router();

router.post("/",authMiddleware,createTransaction);

module.exports = router;