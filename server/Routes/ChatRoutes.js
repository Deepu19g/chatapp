var express = require("express");
var router = express.Router();
const Room=require("../Models/Room")
//send prev chats

  router.post("/data", (req, res) => {
    let senddata = async (data1) => {
        let result = [];
        try {
          result = await Room.find(
            //{ $and: [  {sender:{$eq:data2} }, { roomno:{$eq:data1} }  ] }
            {
              invitecode: { $eq: data1 },
            }
          );
          //console.log(result);
        } catch (err) {
          console.log(err);
        }
      
        return result;
      };
      
    senddata(req.body.invitecode).then((data) => {
      res.json(data);
    });
  });

  router.post("/post", (req, res) => {
    let connection = async (itm) => {//save chats in rooms
      try {
        let room = await Room.find({ invitecode: itm.invitecode }).exec();
        // console.log("data" + JSON.stringify(data));
        room[0].chat = [...room[0].chat, itm];
        room[0].time = itm.time;
        //itm.roomno=data[0].roomno
        //const chat = new Chat(itm);
        await room[0].save();
      } catch (e) {
        console.log(e);
      }
    };
    connection(req.body).then(res.json("good"));
  });

  module.exports=router