const express = require("express");
const authRouter = require("./routes/auth.route.js");
const accountRouter = require("./routes/account.routes.js")
const app = express();
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.use("/api/auth",authRouter);
app.use("/api/accounts",accountRouter);

module.exports = app;