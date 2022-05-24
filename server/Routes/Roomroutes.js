var express = require("express");
var router = express.Router();
const Room=require("../Models/Room")
const app = express();
const http = require("http");
const auth = require("../Middleware/auth");
const { v1: uuidv1 } = require("uuid");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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
  
  router.post("/roomcreate", (req, res) => {
    let roomdata = async (itm) => {
      itm.admin = itm.members;
      itm.invitecode = uuidv1().split("-")[0];
      console.log(itm);
      io.to(itm.invitecode).emit("help");
      try {
        let room = new Room(itm);
  
        await room.save();
  
        res.send({ invitecode: itm.invitecode, room: room });
      } catch (err) {
        res.status(500).send("room cant be created");
      }
    };
    roomdata(req.body);
  });

  //delete room
router.delete("/delete", (req, res) => {
  let del = async () => {
    try {
      let room = await Room.findOne({ invitecode: req.body.invitecode });

      if (room.admin.includes(req.body.email)) {
        await Room.deleteOne({ invitecode: req.body.invitecode });

        io.to(req.body.invitecode).emit("deleted");
        res.send("room deleted");
      } else {
        res.status(400).send({ msg: "only admins can delete room" });
      }
    } catch (err) {
      console.log(err);
    }
  };
  del();
});

router.post("/leave", (req, res) => {
  let find = async () => {
    try {
      let targetRoom = await Room.find({ invitecode: req.body.invitecode });
      targetRoom[0].members = targetRoom[0].members.filter(
        (itm) => itm != req.body.email
      );
      targetRoom[0].chat = [
        ...targetRoom[0].chat,
        { txt: `${req.body.userName} have left group` },
      ];
      await targetRoom[0].save();
      io.in(req.body.invitecode).emit("leave", {
        txt: `${req.body.userName} have left group`,
      });

      res.send("good");
    } catch (err) {
      console.log(err);
      res.send("bad");
    }
  };
  find();
});


router.post("/recents", auth, (req, res) => {
  let recents = async ({ email }) => {
    //console.log("email"+email)
    try {
      //let user=await User.find({email:email})
      let roomarray = await Room.find({ members: email });
      if (roomarray.length !== 0) {
        let roomnos = roomarray.map((itm) => itm.roomno);

        result = await Room.aggregate([
          {
            $match: {
              $expr: {
                $in: ["$roomno", roomnos],
              },
            },
          },
          {
            $sort: {
              time: -1,
            },
          },
        ]);

        //console.log({"msg":result})
        return result;
      } else {
        return [];
      }
    } catch (er) {
      console.log(er);
    }
  };
  recents(req.body).then((data) => res.json(data));
});

//upload pic
router.post("/roompic", async (req, res) => {
  let { invite, url } = req.body;

  let targroom = await Room.find({ invitecode: invite });

  targroom[0].roompic = url;
  await targroom[0].save();
  res.json({ msg: "pic updated" });
});

  module.exports=router