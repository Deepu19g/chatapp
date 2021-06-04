import { React, useState, useEffect } from "react";
import axios from "axios";
function Chatroom({ socket, username }) {
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);

  const sendmsg = async() => {
    try{
      const res=await axios.post('/post', {
        sender: username,
        msgs:recieved
      })
      socket.emit("send", { message: msg });
    }catch(e){
      console.log(e)
    }
   
    
    setmsg("");
  };

  const setmymsg = (e) => setmsg(e.target.value);
  console.log(username);
  useEffect(() => {
    socket.on("text", (data) => {
      console.log("recieved broadcast msg");
      console.log(data.message);
      setrecieved((prev) => [...prev, data.message]);
    });
  }, []);
  /*let save= async()=>{
     console.log("reaching client blur")
     try{
      const res=await fetch('http://localhost:5000/post', {
        method: 'POST',
        headers: {
         
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "mode" : "no-cors"
        },
        body: JSON.stringify({
          sender:username,
          msgs:recieved
        })
      })
      console.log(res)
     }catch(e){
       console.log("failed")
     }
    
  }*/
  return (
    <div>
      <p>Message:</p>
      <input value={msg} onChange={setmymsg} ></input>
      <button onClick={sendmsg}>Send</button>
      {recieved.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
}

export default Chatroom;
