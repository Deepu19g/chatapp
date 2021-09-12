const jwt=require('jsonwebtoken')
module.exports = function (req,res,next) { 
    
   
    let token=req.headers.authorization.split(" ")[1]
    //console.log(token)
    if(token!=undefined && token!=null){
        try{
            req.decoded=jwt.verify(token,process.env.SECRETKEY)
            //console.log(req.decoded)
            next()
        }catch(err){
            console.log("error found")
           res.status(401).send({msg:"invalid token"})
        }
        
    }else{
        res.status(400).send({msg:"token null"})
    }
   
    
};