const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const jwt=require('jsonwebtoken')
const auth=require("./Middleware/auth")
require('dotenv').config()
/*const http = require('http');

const { Server } = require("socket.io");
const io = new Server(server);*/
app.use(express.json());
const uri =
  "mongodb+srv://Deepak:mongodb20@cluster0.gdc4p.mongodb.net/sample_airbnb?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();
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
app.use(cors(corsOptions));
//app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

let roomarray=[]
let connection = async (itm) => {
  try {
    const result = await client
      .db("sample_airbnb")
      .collection("ListingsAndReviews")
      .insertOne(itm);
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
    //console.log(data)
    res.json(data);
  });
});

//server recieving a post request

//user signup
let signup = async (data, res) => {
  try {
    let result=await client
    .db("sample_airbnb")
    .collection("ListingsAndReviews").findOne({email:{ $eq: data.email }})
    
    if(result==undefined){
      await client
      .db("sample_airbnb")
      .collection("ListingsAndReviews")
      .insertOne(data);
const accToken=jwt.sign(data,process.env.SECRETKEY)
    res.send(accToken);
    }else{
      res.status(403).json({msg:"user already exists"})
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
//console.log(result[0])
if(result[0]!==undefined){
  if (result[0].password == password) {
    return "success";
  } else {
    return "incorrect username or password";
  }

}else{
  return "user not registered"
}
};
app.post("/login", (req, res) => {
  login(req.body, res).then((data) => {
    res.json(data);
  });
});

//setting roomdata
let roomdata = async (itm) => {
  try {
    const result = await client
      .db("sample_airbnb")
      .collection("ListingsAndReviews")
      .insertOne(itm);
  } catch (err) {
    console.log(err);
  }
};
app.post("/roomdata", (req, res) => {
  roomdata(req.body).then((data) => {
    res.send(data);
  });
});

//fetching recent rooms and sorting them
let recents = async ({ email }) => {
  //console.log("email"+email)
  try {
    result = await client
      .db("sample_airbnb")
      .collection("ListingsAndReviews")
      .find(
        //{ $and: [  {sender:{$eq:data2} }, { roomno:{$eq:data1} }  ] }
        {
          member: { $eq: email },
        }
      )
      .toArray();

    return result;
  } catch (er) {
    console.log(er);
  }
};
//obtaining last chat of each grp and sort  them to a array in descending order of time and send response array back
let sendata = async (rno, email) => {
  try {
    let result = [];
    //let result=[{time:1},{time:2},{time:3},{time:4},{time:5},{time:6}]

    if (rno) {
      for (let itm of rno) {
        const pipeline =[
          {
            '$match': {
              'roomno': `${itm.roomno}`, 
              'time': {
                '$exists': true
              }
            }
          }, {
            '$sort': {
              'time': -1
            }
          }, {
            '$limit': 1
          }
        ]
        let val = await client
          .db("sample_airbnb")
          .collection("ListingsAndReviews")
          .aggregate(pipeline)
          .toArray();
        //
        
        if(val[0]!=null){
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
    at right place */
        let pi = partition(low, high);

        // Separately sort elements before
        // partition and after partition
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };

    await  quickSort(0, result.length - 1)

    return result;
  } catch (err) {
    console.log(err);
  }
};
app.post("/recents",auth, (req, res) => {
  recents(req.body).then((data) => {
   
    if(data.length!=0){
      for(let ob2 of data){
       
        roomarray.push(ob2.roomno)
      }
    
    sendata(data, req.email).then((data) => res.json(data));
    }else{
      res.json([])
    }
   
  });
});

//socket stuff
let roomid = "";
io.on("connection", (socket) => {
  //console.log(`a user connected ${socket.id}`);
  
/*const collection = client.db("sample_airbnb").collection("ListingsAndReviews");
  const changeStream = collection.watch([]);
  changeStream.on('change', (next) => {
  console.log(next)
  //io.to(socket.id).emit("changed");
  //socket.join(next.fullDocument.roomno)
  //socket.to().emit("changed")
  socket.broadcast.to(next.fullDocument.roomno).emit("changed")
});*/
  socket.on("join", (data) => {
    console.log("joined all")
    if(data!=={}){
    socket.join(data.no);
    roomid = data.no;
    }
    socket.join(roomarray)
  });

  socket.on("send", (data) => {
    console.log("reached send call server")
    io.to(roomid).emit("text", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
