const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");


async function userRegisterController(req,res){
    try {
        const{email,username,password} = req.body;
        const isExist = await userModel.findOne({email});
        if(isExist){
            return res.status(422).json({
                message:"User already exists",
                status:"failed"
            });
        }
        const user = await userModel.create({
            email:email,username:username,password:password
        });
        let id = user._id;
        const token = jwt.sign({id,email,username},process.env.JWT_SECRET,{expiresIn:"3d"});
        res.cookie("token",token);
        res.status(201).json({
            user:{
                id:user._id,
                email:user.email,
                username:user.username
            },token
        });
    } catch (error) {
        console.error("userRegisterController error:", error);
        res.status(500).json({
            message: "Internal server error",
            status: "failed"
        });
    }
}



async function userLoginController(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "User does not exist" });
        }

        const isValid = await user.comparePassword(password);
        if(!isValid){
            return res.status(401).json({message:"email or password is wrong"});
        }
        const token = jwt.sign({id:user._id,email:user.email,username:user.username},process.env.JWT_SECRET,{expiresIn:"3d"});
        res.cookie("token",token);
        res.status(200).json({
            user:{
                id:user._id,
                email:user.email,
                username:user.username
            },token
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = {userRegisterController,userLoginController};
