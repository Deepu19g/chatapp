import { React, useState } from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
function Chatroom() {
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState("");
  let sendmsg = (e) => {
    socket.emit("send", { message: msg });
  };
  socket.on("text", (data) => {
    console.log("recieved broadcast msg");
    setrecieved(data);
    console.log(data.message);
  });
  let setmymsg = (e) => {
    setmsg(e.target.value);
  };
  return (
    <div>
      <input value={msg} onChange={setmymsg}></input>
      <button type="submit" onClick={sendmsg}>
        Send
      </button>
      <input type="text" val={recieved}></input>
    </div>
  );
}

export default Chatroom;
