const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const auth = require("./Middleware/auth");
const mongoose = require("mongoose");
const Chat = require("./Models/Chat");
const User = require("./Models/User");
const Room = require("./Models/Room");
const AdminRoute = require("./Routes/Addadmin");
const UserRoute = require("./Routes/Userroutes");
const { ObjectId } = require("mongodb");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();

//const http = require('http');
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
require("./Socket")(io, Room);

app.use(express.json());

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to db"));

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  header: {
    "Content-Type":
      "application/x-www-form-urlencoded; charset=UTF-8;application/json",
  },
};
var cors = require("cors");
const { json } = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const { match } = require("assert");
app.use(cors(corsOptions));
//app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.use("/user", UserRoute);

app.post("/post", (req, res) => {
  let connection = async (itm) => {
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

app.post("/addmember", (req, res) => {
  let { invitecode, email } = req.body;
  let addadmin = async () => {
    //console.log(invitecode)
    try {
      let room = await Room.find({ invitecode: invitecode }).exec();

      res.send({ members: room[0].members });
    } catch (err) {
      console.log(err);
      res.status(404).send("room not found");
    }
  };
  addadmin();
});
//finding lastest chat
/*let latest=async(data1)=>{
  try {

    await client.connect();
    result = await client
      .db("sample_airbnb")
      .collection("ListingsAndReviews")
      .find(
       
        {
          roomno: { $eq: data1 },
            
        }
      ).sort({  time: -1 })
      .toArray();
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
app.post("/latest",(req, res) => {
 
  
})*/

//send prev chats
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

app.post("/data", (req, res) => {
  senddata(req.body.invitecode).then((data) => {
    res.json(data);
  });
});

//server recieving a post request

//user signup
let signup = async (data, res) => {
  try {
    /*let result=await client
    .db("sample_airbnb")
    .collection("ListingsAndReviews").findOne({email:{ $eq: data.email }})*/

    let result = await User.find({ email: { $eq: data.email } }).exec();

    if (result.length == 0) {
      const user = new User(data);
      await user.save();

      const accToken = jwt.sign(data, process.env.SECRETKEY);
      res.send(accToken);
    } else {
      res.status(403).json({ msg: "user already exists" });
    }
  } catch (err) {
    console.log(err);
  }
};
app.post("/signup", (req, res) => {
  signup(req.body, res);
});

//login authentication
let login = async ({ email, password }) => {
  let result = [];
  //console.log("reached login")
  result = await User.find({
    email: { $eq: email },
  });
  if (result[0] !== undefined) {
    if (result[0].password == password) {
      return "success";
    } else {
      return "incorrect username or password";
    }
  } else {
    return "user not registered";
  }
};
app.post("/login", (req, res) => {
  login(req.body, res).then((data) => {
    res.json(data);
  });
});

//create room

app.post("/roomcreate", (req, res) => {
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

//join a room



//fetching recent rooms and sorting them
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

app.post("/recents", auth, (req, res) => {
  /*recents(req.body).then((data) => {
    if (data.length != 0) {
      for (let ob2 of data) {
        roomarray.push(ob2.roomno);
      }

      sendata(data, req.email).then((data) => res.json(data));
    } else {
      res.json([]);
    }
  });*/
  recents(req.body).then((data) => res.json(data));
});
//upload pic
app.post("/roompic", async (req, res) => {
  let { invite, url } = req.body;

  let targroom = await Room.find({ invitecode: invite });

  targroom[0].roompic = url;
  await targroom[0].save();
  res.json({ msg: "pic updated" });
});
//leave room
app.post("/leave", (req, res) => {
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

//delete room
app.delete("/delete", (req, res) => {
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

//socket stuff

server.listen(5000, () => {
  console.log("listening on *:5000");
});

