var express = require("express");
var router = express.Router();
const User = require("../Models/User")

router.get("/userlist",(req,res)=>{
    User.find().exec().then((qresult)=>res.send({users:qresult}));
    
})

module.exports=router