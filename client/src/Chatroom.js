import { React, useState, useEffect } from "react";

function Chatroom({ socket }) {
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);

  const sendmsg = (e) => {
    socket.emit("send", { message: msg });
    setmsg("");
  };

  const setmymsg = (e) => setmsg(e.target.value);

  useEffect(() => {
    socket.on("text", (data) => {
      console.log("recieved broadcast msg");
      console.log(data.message);
      setrecieved((prev) => [...prev, data.message]);
    });
  }, []);

  return (
    <div>
      <p>Message:</p>
      <input value={msg} onChange={setmymsg}></input>
      <button onClick={sendmsg}>Send</button>
      {recieved.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
}

export default Chatroom;
