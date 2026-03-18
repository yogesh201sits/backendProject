const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");


function userRegisterController(req,res){
    const{email,username,password} = req.body;
    const isExist = userModel.findOne({email});
    if(isExist){
        return res.status(422).json({
            message:"User aready exists",
            status:"failed"
        });
    }
    const user = userModel.create({
        email:email,username:username,password:password
    })
    const token = jwt.sign({email,username},process.env.JWT_SECRET,{expiresIn:"3d"});
    res.cookie("token",token);
    
}

module.exports = {userRegisterController};
