import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatroom.css";
import AppBar from "@mui/material/AppBar";
//import {Popover} from 'react-bootstrap'
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { io } from "socket.io-client";
import Toolbar from "@mui/material/Toolbar";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

function Mobilechatroom({ location }) {
  const history = useHistory();
  //let { obj }=useParams()
  let { rno, email, cp } = location.state.data;
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const socket2 = useRef();
  //const socket= Object(location.state.data.socket)
  //console.log(location.state.data.socket)
  //const [subrecent,setsubrecent] = useState(recent2)
  //console.log(location.state);
  const sendmsg = async () => {
    try {
      // console.log("done")
      const res = await axios.post("http://localhost:5000/post", {
        sender: email,
        msgs: msg,
        roomno: rno,
        invitecode: cp,
        time: new Date().getTime(),
      });
      console.log("after posting chat");
      socket2.current.emit("send", {
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
      history.goBack();
    }
  };

  console.log(cp);
  useEffect(() => {
    //sock2et.current.emit()
    socket2.current = io("ws://localhost:5000");
    return () => {
     console.log("sock child closw")
      socket2.current.close()
    };
  }, []);

  let handledel = async () => {
    let res = "";
    try {
      res = await axios.delete("http://localhost:5000/delete", {
        data: {
          invitecode: cp,
          email: email,
        },
      });
      history.goBack();
    } catch (err) {
      alert(err.response.data.msg);
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    //setsubrecent(recent2)
    const roomsocket = socket2.current.on("text", (data) => {
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
        let status = await axios.post("http://localhost:5000/data", {
          invitecode: cp,
        });
        //.then((res) => res.data);

        setrecieved(status.data);
        setmsg("");
      } catch (err) {
        console.log(err);
      }
    };
    initialdata();
    socket2.current.emit("join", { no: cp, email: email });
    
  }, [cp]);

  let leaveRoom = async () => {
    let res = await axios.post("http://localhost:5000/leave", {
      email: email,
      invitecode: cp,
    });
    if (res.data == "good") {
      console.log(res.data);
      console.log(res.data == "good");
      history.goBack();
    }
  };
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div id="msgside">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" style={{ backgroundColor: "orange" }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => history.goBack()}
            >
              <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {rno}
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
      </Box>
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
      <div style={{ position: "sticky", bottom: 10 }}>
        <input value={msg} onChange={setmymsg} id="inpbox"></input>
        <button onClick={sendmsg}>Send</button>
      </div>
    </div>
  );
}

export default Mobilechatroom;
