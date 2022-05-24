const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");


const mongoose = require("mongoose");
const Chat = require("./Models/Chat");
const User = require("./Models/User");
const Room = require("./Models/Room");
const AdminRoute = require("./Routes/Addadmin");

const { ObjectId } = require("mongodb");

require("dotenv").config();

//const http = require('http');
const Roomroutes = require("./Routes/Roomroutes");
const ChatRoutes=require("./Routes/ChatRoutes")
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
require("./Socket")(io, Room);
const UserRoute = require("./Routes/Userroutes");
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
//const { match } = require("assert");
app.use(cors(corsOptions));
//app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

app.use("/user", UserRoute);
app.use("/room", Roomroutes);
app.use("/chat", ChatRoutes);


/*app.post("/addmember", (req, res) => {
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
});*/
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



//socket stuff

server.listen(5000, () => {
  console.log("listening on *:5000");
});
