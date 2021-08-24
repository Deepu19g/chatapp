import { React, useState, useEffect } from "react";
import axios from "axios";
import "./Chatroom.css";
function Chatroom({ socket, email, recent2 }) {
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);
 const [subrecent,setsubrecent] = useState(recent2)
  const sendmsg = async () => {
    try {
      // console.log("done")
      const res = await axios.post("http://localhost:5000/post", {
        sender: email,
        msgs: msg,
        roomno: recent2,
        time: new Date().getTime(),
      });
      socket.emit("send", { msgs: msg, sender: email, roomno: recent2 });


    } catch (e) {
      console.log(e);
    }

    setmsg("");
  };
  //get previous chats
 
  const setmymsg = (e) => setmsg(e.target.value);
  //console.log(username);
  
  console.log(subrecent)

  useEffect(() => {
    socket.on("text", (data) => {
      console.log("recieved broadcast msg");
      console.log(data.roomno)
      console.log(subrecent);
      if (data.roomno == subrecent) {
        //console.log("yeah matched")
        
        setrecieved((prev) => [...prev, data]);
      }
    });

    
  }, []);
    useEffect(() => {
    setsubrecent(recent2)
    let initialdata = async () => {
      //setrecieved([]);
      console.log("initialdata called")
      console.log(recent2);
      try {
        let status = await axios
          .post("http://localhost:5000/data", {
            roomno: recent2,
          })
          //.then((res) => res.data);
       
        setrecieved(status.data);
      } catch (err) {
        console.log(err);
      }
    };
    initialdata();
  }, [recent2]);
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
