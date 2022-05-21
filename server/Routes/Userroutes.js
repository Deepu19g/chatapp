var express = require("express");
var router = express.Router();
const User = require("../Models/User")
const Room=require("../Models/Room")
router.post("/userlist",(req,res)=>{
    let getuserlist=async()=>{
        let roomusers
       await  Room.find({ invitecode: req.body.invite }).exec().then(qresult=>{
            roomusers=qresult[0].members
           
        });
       
        User.find().exec().then(qresult=>{
           
            //let result=qresult.map(itm=>itm.email)
           
            let remainingusers=qresult.filter(itm=>{
                
                if(roomusers.includes(itm.email)==false){
                   return itm
                }
            })
            let userlist=remainingusers.map(itm=>itm.username)
            res.send({"userlist":userlist})
        });
        
    }
    getuserlist()
    
})



router.post("/roomjoin", (req, res) => {
    let roomjoin = async (itm) => {
      let room = await Room.find({ invitecode: itm.invite }).exec();
  
      if (room.length !== 0) {
        let newData = {};
        if (room[0].members.includes(itm.members) === false) {
          room[0].members = [...room[0].members, ...itm.members];
          room[0].chat = [
            ...room[0].chat,
            { txt: `${itm.userName} have joined group` },
          ];
          console.log({ invite: itm.invite });
          io.in(itm.invite).emit("userjoin", {
            txt: `${itm.userName} have joined group`,
          });
          await room[0].save();
          res.send("room joined");
          /*let changeStream=Room.watch({ fullDocument: 'updateLookup' })
         
          changeStream.on('change',(next)=>{
            console.log(next)
            //console.log("reached next")
            res.send(next)
           
          })*/
        }
      } else {
        res.status(400).send("room not found");
      }
      //itm._id=temp[0]._id
    };
    roomjoin(req.body);
  });

module.exports=router