const express = require("express");
const app = express();
/*const http = require('http');

const { Server } = require("socket.io");
const io = new Server(server);*/
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});
var num=0;

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`);
 
  socket.on("join", (data) => {
    console.log("joined")
    console.log(data);
    socket.join(data.no)
    num=data.no
    
    //console.log(num);
  });
  
  socket.on("send",(data)=>{
    console.log(num)
    socket.to(num).emit("text",data)
  })
  
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
