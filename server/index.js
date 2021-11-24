const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const jwt = require("jsonwebtoken");
const auth = require("./Middleware/auth");
const mongoose = require("mongoose");
const Chat = require("./Models/Chat");
const User = require("./Models/User");
const Room = require("./Models/Room");
const { ObjectId } = require("mongodb");
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();
/*const http = require('http');

const { Server } = require("socket.io");
const io = new Server(server);*/
app.use(express.json());

/*const client = new MongoClient(uri);
client.connect();*/
mongoose.connect(process.env.URI).then(console.log("connected to db"));
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
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
app.post("/post", (req, res) => {
  connection(req.body);
  res.json("good");
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
    //console.log(data)
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

    let room = new Room(itm);
    await room.save();
    res.send({ invitecode: itm.invitecode });
  };
  try {
    console.log(req.body);

    roomdata(req.body);
  } catch (err) {
    res.status(500).send("room cant be created");
  }
});

//join a room

app.post("/roomjoin", (req, res) => {
  let roomjoin = async (itm) => {
    let room = await Room.find({ invitecode: itm.invite }).exec();

    if (room.length !== 0) {
      if (room[0].members.includes(itm.members) === false) {
        room[0].members = [...room[0].members, itm.members];
        await room[0].save();
      }
      res.send(room[0].invitecode);
    } else {
      res.status(400).send("room not found");
    }
    //itm._id=temp[0]._id
  };
  roomjoin(req.body);
});

//fetching recent rooms and sorting them
let recents = async ({ email }) => {
  //console.log("email"+email)
  try {
    //let user=await User.find({email:email})
    let roomarray = await Room.find({ members: email });
    if (roomarray.length !== 0) {
      let roomnos = roomarray.map((itm) => itm.roomno);
      console.log("rnos" + JSON.stringify(roomnos));
      console.log("type");
      console.log(roomnos);
      result = await Room.aggregate(
        [
          {
            '$match': {
              '$expr': {
                '$in': [
                  '$roomno', roomnos
                ]
              }
            }
          }, {
            '$sort': {
              'time': -1
            }
          }
        ]
      );
      console.log("result" + JSON.stringify(result));
      //return lastchatarray;
      //let times = result.map((itm) => itm.lastchat);
      //let lastchatarray = await Chat.find({ time: times }).populate('roomno');
      //let latestroom = await Room.find({ time: times });

      //console.log("sortedlist" + JSON.stringify(lastchatarray));
      return result;
      //console.log(result[1].msgs);
      //return result;
    } else {
      return [];
    }
  } catch (er) {
    console.log(er);
  }
};

//obtaining last chat of each grp and sort  them to a array in descending order of time and send response array back
/*let sendata = async (rno, email) => {
  try {
    let result = [];
    //let result=[{time:1},{time:2},{time:3},{time:4},{time:5},{time:6}]

    if (rno) {
      for (let itm of rno) {
        const pipeline = [
          {
            $match: {
              roomno: `${itm.roomno}`,
              time: {
                $exists: true,
              },
            },
          },
          {
            $sort: {
              time: -1,
            },
          },
          {
            $limit: 1,
          },
        ];
        let val = await client
          .db("sample_airbnb")
          .collection("ListingsAndReviews")
          .aggregate(pipeline)
          .toArray();
        //

        if (val[0] != null) {
          result.push(val[0]);
        }
      }
    }

    let swap = (a, b) => {
      let t = a;
      a = b;
      b = t;
      return [a, b];
    };
    let partition = (low, high) => {
      let pivot = result[high].time; // pivot
      let i = low - 1; // Index of smaller element and indicates the right position of pivot found so far

      for (let j = low; j <= high - 1; j++) {
        // If current element is smaller than the pivot
        if (result[j].time < pivot) {
          i++; // increment index of smaller element
          [result[i], result[j]] = swap(result[i], result[j]);
        }
      }
      [result[i + 1], result[high]] = swap(result[i + 1], result[high]);

      return i + 1;
    };

    let quickSort = async (low, high) => {
      if (low < high) {
        /* pi is partitioning index, arr[p] is now 
    at right place 
        let pi = partition(low, high);

        // Separately sort elements before
        // partition and after partition
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };

    await quickSort(0, result.length - 1);

    return result;
  } catch (err) {
    console.log(err);
  }
};*/
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
      await targetRoom[0].save();
      res.send("good");
    } catch (err) {
      res.send("bad");
    }
  };
  find();
});

//delete room
app.delete("/delete", (req, res) => {
  let del = async () => {
    try {
      console.log("reached back del");
      let room = await Room.findOne({ invitecode: req.body.invitecode });
      console.log(req.body);
      console.log(room);
      if (room.admin.includes(req.body.email)) {
        await Room.deleteOne({ invitecode: req.body.invitecode });
        await Chat.deleteOne({ invitecode: req.body.invitecode });
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
let roomid = "";
io.on("connection", (socket) => {
  //console.log(`a user connected ${socket.id}`);
  console.log("connected");
  /*const collection = client.db("sample_airbnb").collection("ListingsAndReviews");
  const changeStream = collection.watch([]);
  changeStream.on('change', (next) => {
  console.log(next)
  //io.to(socket.id).emit("changed");
  //socket.join(next.fullDocument.roomno)
  //socket.to().emit("changed")
  socket.broadcast.to(next.fullDocument.roomno).emit("changed")
});*/
  socket.on("initialjoin", (data) => {
    let roomarrset = async () => {
      try {
        let roomarray = await Room.find({ members: data.email });
        let roomcode = [];
        for (obj of roomarray) {
          roomcode = [...roomcode, obj.invitecode];
        }

        if (roomarray.length !== 0) {
          //console.log("rarray reached")
          //console.log(roomnos)
          socket.join(roomcode);
          console.log("joined rooms" + JSON.stringify(roomcode));
        }
      } catch (err) {
        console.log(err);
      }
    };
    roomarrset();
  });
  socket.on("join", (data) => {
    socket.join(data.no);
  });

  socket.on("send", (data) => {
    console.log("sended" + JSON.stringify(data));
    io.in(data.invitecode).emit("text", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
