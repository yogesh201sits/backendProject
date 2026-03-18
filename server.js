const app = require("./src/app.js")
const connectDB = require("./src/config/db.js")
require("dotenv").config();

(async () => {
    await connectDB();
    app.get("/",(req,res)=>{
        res.send("Hello");
    })
    app.listen(3000,()=>{
        console.log("Server started");
    })
})();