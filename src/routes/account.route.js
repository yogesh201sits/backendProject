const express = require("express");
const {authMiddleware} = require("../middleware/auth.middleware.js")
const {createAccountController} = require("../controllers/account.controller.js")

const router = express.Router();

router.post("/",authMiddleware,createAccountController);

module.exports = router;