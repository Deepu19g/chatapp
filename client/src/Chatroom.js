import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatroom.css";
import { Navbar, Container, OverlayTrigger } from "react-bootstrap";
//import {Popover} from 'react-bootstrap'
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import  IconButton  from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import {Popover} from 'react-bootstrap'
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";

import { faArrowLeft, faEllipsisV, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function Chatroom({ socket, email, recent2, setrecent,invite }) {
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);
console.log(invite)
  //const [subrecent,setsubrecent] = useState(recent2)
  const sendmsg = async () => {
    try {
      // console.log("done")
      const res = await axios.post("http://localhost:5000/post", {
        sender: email,
        msgs: msg,
        roomno: recent2,
        invitecode:invite,
        time: new Date().getTime(),
      });
      console.log("after posting chat");
      socket.emit("send", { msgs: msg, sender: email, roomno: recent2 });
    } catch (e) {
      console.log(e);
    }

    setmsg("");
  };
  //get previous chats

  const setmymsg = (e) => setmsg(e.target.value);
  //console.log(username);

  useEffect(() => {
    //socket.current.emit()
    console.log("initialised socket");
    const roomsocket = socket.on("text", (data) => {
      console.log(data.msgs);
      console.log(recent2);
      if (data.roomno === recent2) {
        console.log("yeah matched");

        setrecieved((prev) => [...prev, data]);
      }
    });
    return () => socket.off("text", roomsocket);
  }, [recent2]);
  console.log(recent2);
  useEffect(() => {
    //setsubrecent(recent2)
    let initialdata = async () => {
      //setrecieved([]);
      console.log("initialdata called");
      //console.log(recent2);
      try {
        let status = await axios.post("http://localhost:5000/data", {
          roomno: recent2,
        });
        //.then((res) => res.data);
        //console.log(recent2);
        console.log(status);
        setrecieved(status.data);
      } catch (err) {
        console.log(err);
      }
    };
    initialdata();
    setmsg("");
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
  console.log("loaded roomchat");
  let leaveRoom = async () => {
    let res = await axios.post("http://localhost:5000/leave", {
      email: email,
      roomno: recent2,
    });

    history.goBack();
  };
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  let handledel = async () => {
    console.log("reached del");
    let res = "";
    try {
      res = await axios.delete("http://localhost:5000/delete", {
        data: {
          roomno: recent2,
          email: email,
        },
      });
    } catch (err) {
      if (err.response) {
        alert(err.response.data.msg);
      }

      console.log(err.response.data);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div >
      <AppBar position="static" style={{ backgroundColor: "orange" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setrecent("")}
          >
            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {recent2}
          </Typography>

          <IconButton onClick={handleClick}>
            <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography sx={{ p: 2 }} component={"div"}>
              {" "}
              <ul>
                <p onClick={leaveRoom}>Leave Room</p>
                <p onClick={handledel}>Delete Room</p>
              </ul>
            </Typography>
          </Popover>
        </Toolbar>
      </AppBar>
      <div className="d-flex flex-column chatdiv">
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
      <div  >
        <input value={msg} onChange={setmymsg} id="inpbox"></input>
        
        <FontAwesomeIcon icon={faPaperPlane} onClick={sendmsg}></FontAwesomeIcon>
      </div>
    </div>
  );
}

export default Chatroom;
