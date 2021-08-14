import { React, useState, useEffect } from "react";
import axios from "axios";
import "./Chatroom.css";
function Chatroom({ socket, email, recent }) {
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);
  console.log(socket);
  const sendmsg = async () => {
    try {
      // console.log("done")
      const res = await axios.post("http://localhost:5000/post", {
        sender: email,
        msgs: msg,
        roomno: recent,
      });
      socket.emit("send", { msgs: msg, sender: email, roomno: recent });

      // console.log(res)
    } catch (e) {
      console.log(e);
    }

    setmsg("");
  };
  //get previous chats
  let initialdata = async () => {
    console.log("initialdata called")
    console.log(recent)
    try {
      let status = await axios
        .post("http://localhost:5000/data", {
          roomno: recent,
          
        })
        .then((res) => res.data);
      console.log(status);
      setrecieved((prev) => [...prev, ...status]);
    } catch (err) {
      console.log(err);
    }
  };
  const setmymsg = (e) => setmsg(e.target.value);
  //console.log(username);
  useEffect(() => {
    socket.on("text", (data) => {
      console.log("recieved broadcast msg");
      console.log(data.message);
      setrecieved((prev) => [...prev, data]);
    });
  }, []);


  useEffect(() => {
    initialdata();
  }, [recent]);
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
    <div id="msgside">
      <div className="d-flex flex-column">
        {recieved.map((msg, index) => {
          if (msg.sender === email) {
           
            return (
              <p
                key={index}
                style={{
                  alignSelf: "flex-end",
                  backgroundColor: "#931bf5",
                  color: "white",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                {msg.msgs}
              </p>
            );
          } else {
            return (
              <p
                key={index}
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#f3f0f5",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                {msg.msgs}
              </p>
            );
          }
        })}
      </div>
      <div style={{ position: "sticky", bottom: 10 }}>
        <input value={msg} onChange={setmymsg} id="inpbox"></input>
        <button onClick={sendmsg}>Send</button>
      </div>
    </div>
  );
}

export default Chatroom;
