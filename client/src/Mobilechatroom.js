import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatroom.css";
//import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
//import {Popover} from 'react-bootstrap'
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import {io} from 'socket.io-client'
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight, faArrowLeft, faEllipsisV,faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import Toolbar from "@mui/material/Toolbar";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

function Mobilechatroom({ location}) {
  const navigate = useNavigate();
  //let { obj }=useParams()
  console.log(location)
  let { rno, email, cp,user } = location.state;
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  let socket=useRef()
  //const socket= Object(location.state.data.socket)
  //console.log(location.state.data.socket)
  //const [subrecent,setsubrecent] = useState(recent2)
  
  const sendmsg = async () => {
    try {
      // console.log("done")
      const res = await axios.post("http://localhost:5000/chat/post", {
        user:user,
        sender: email,
        msgs: msg,
        roomno: rno,
        invitecode: cp,
        time: new Date().getTime(),
      });
      console.log("after posting chat");
      socket.current.emit("send", {
        msgs: msg,
        sender: email,
        invitecode: cp,
      });
    } catch (e) {
      console.log(e);
    }

    setmsg("");
  };
  //get previous chats

  const setmymsg = (e) => setmsg(e.target.value);
  //console.log(username);

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });

  const updateMedia = () => {
    console.log("reached resize");
    if (window.innerWidth > 576) {
      navigate(-1);
    }
  };

  console.log(cp);
  

  let handledel = async () => {
    let res = "";
    try {
      res = await axios.delete("http://localhost:5000/room/delete", {
        data: {
          invitecode: cp,
          email: email,
        },
      });
    navigate(-1);
    } catch (err) {
      alert(err.response.data.msg);
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    //sock2et.current.emit()
    
    socket.current=io("ws://localhost:5000")
    
    return () => {
      console.log("sock child closw");
      socket.current.close();
    };
  }, []);

  useEffect(() => {
    //setsubrecent(recent2)
    const roomsocket = socket.current.on("text", (data) => {
      //console.log(data);
      console.log("hai");
      if (data.invitecode === cp) {
        console.log("yeah matched");

        setrecieved((prev) => [...prev, data]);
      }
    });
    let initialdata = async () => {
      //setrecieved([]);

      //console.log(recent2);
      try {
        let status = await axios.post("http://localhost:5000/chat/data", {
          invitecode: cp,
        });
        //.then((res) => res.data);

      
        setrecieved(status.data[0].chat);
        setmsg("");
      } catch (err) {
        console.log(err);
      }
    };
    initialdata();
    socket.current.emit("join", { no: cp, email: email });
  }, [cp]);

  let leaveRoom = async () => {
    let res = await axios.post("http://localhost:5000/room/leave", {
      email: email,
      invitecode: cp,
    });
    if (res.data == "good") {
      console.log(res.data);
      console.log(res.data == "good");
      navigate(-1);
    }
  };
  
  
  return (
    <div id="msgside">
     
      <div className="d-flex flex-column chatdiv">
        {recieved.map((msg, index) => {
          if (msg.sender === email) {
            return (
              <div
                key={index}
                className="Mobchatroom-msgs Chatroom-chats"
                style={{
                  alignSelf: "flex-end",
                  //backgroundColor: "#931bf5",
                  backgroundColor:"#629dfc",
                  color: "white",
                  padding: 10,
                  borderRadius: 8,
                }}
                
              >
                {msg.msgs}
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="Mobchatroom-msgs Chatroom-chats"
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#f3f0f5",
                  padding: 10,
                  borderRadius: 8,
                }}
                
              >
                 <p className="Scrolltop-Username">{msg.userName}</p>
                <p style={{marginBottom:"0"}}>{msg.msgs}</p>
              </div>
            );
          }
        })}
         <div  style={{
              position: "fixed",
              bottom: 10,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }} id="senddiv">
        <input value={msg} onChange={setmymsg} id="inpbox"></input>
        
        
        <FontAwesomeIcon
              icon={faPaperPlane}
              onClick={sendmsg}
              className="sendbtn"
            ></FontAwesomeIcon>
      </div>
      </div>
     
    </div>
  );
}

export default Mobilechatroom;
