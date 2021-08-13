const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
/*const http = require('http');

const { Server } = require("socket.io");
const io = new Server(server);*/
app.use(express.json());
const uri =
  "mongodb+srv://Deepak:mongodb20@cluster0.gdc4p.mongodb.net/sample_airbnb?retryWrites=true&w=majority";
const client = new MongoClient(uri);
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
app.use(cors(corsOptions));
//app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});
let num = 0;

let connection = async (itm) => {
  try {
    console.log("begore");
    console.log(itm);
    await client.connect();
    const result = await client
      .db("sample_airbnb")
      .collection("ListingsAndReviews")
      .insertOne(itm);
  } catch (e) {
    console.log(e);
  } finally {
    client.close();
  }
};
app.post("/post", (req, res) => {
  console.log("data" + JSON.stringify(req.body));
  connection(req.body);
  res.json("good");
});

let senddata = async (data1) => {
  let result = [];
  try {
    console.log("dara" + data1);
    await client.connect();
    result = await client
      .db("sample_airbnb")
      .collection("ListingsAndReviews")
      .find(
        //{ $and: [  {sender:{$eq:data2} }, { roomno:{$eq:data1} }  ] }
        {
          roomno: { $eq: data1 },
        }
      )
      .toArray();
    //console.log(result);
  } catch (err) {
    console.log(err);
  }

  return result;
};

app.post("/data", (req, res) => {
  senddata(req.body.roomno).then((data) => {
    console.log("returned" + JSON.stringify(data));
    res.json(data);
  });
});

//server recieving a post request

//user signup
let signup = async (data, res) => {
  try {
    await client.connect();
    await client
      .db("sample_airbnb")
      .collection("ListingsAndReviews")
      .insertOne(data);

    res.send("worked");
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
};
app.post("/signup", (req, res) => {
  signup(req.body, res);
});

//login authentication
let login = async ({ email, password }) => {
  let result = [];
  await client.connect();
  result = await client
    .db("sample_airbnb")
    .collection("ListingsAndReviews")
    .find(
      //{ $and: [  {sender:{$eq:data2} }, { roomno:{$eq:data1} }  ] }
      {
        email: { $eq: email },
      }
    )
    .toArray();
  return result;
};
app.post("/login", (req, res) => {
  login(req.body).then((data) => {
    console.log(data);
    res.send(data);
  });
});

//socket stuff
io.on("connection", (socket) => {
  //console.log(`a user connected ${socket.id}`);

  socket.on("join", (data) => {
    console.log("joined");

    socket.join(data.no);
    num = data.no;
  });

  socket.on("send", (data) => {
    console.log("reached sendon");
    io.to(num).emit("text", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
