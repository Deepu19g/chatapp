import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chatroom.css";
import Popover from "@mui/material/Popover";
//import Dummy from "./assets/dummyimage.jpg";
import Dummy from "./assets/dummyimage.jpg";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

import {
  faArrowAltCircleUp,
  faArrowLeft,
  faEllipsisV,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
//import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Zoom from "@mui/material/Zoom";

export function Top(props) {
  const { children, window } = props;

  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

Top.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function BackToTop(props) {
  const { socket, email, cp, rno, setcp, initialfetch } = props;
  const navigate = useNavigate();
  const [roompic, setroompic] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);

  //const [subrecent,setsubrecent] = useState(recent2)
  let picupload = async (e) => {
    handleClose();
    let files = e.target.files;

    if (files[0] !== undefined) {
      let fdata = new FormData();
      fdata.append("file", files[0]);
      fdata.append("upload_preset", "nvjz6yfm");
      let imgresult = await axios.post(
        "https://api.cloudinary.com/v1_1/dlosbkrhb/image/upload",
        fdata
      );

      await axios.post("http://localhost:5000/roompic", {
        url: imgresult.data.secure_url,
        invite: cp,
        email: email,
      });
      setroompic(imgresult.data.secure_url);
    }
  };

  const sendmsg = async () => {
    let userName = localStorage.getItem(`${email}username`);
    try {
      // console.log("done")
      const res = await axios.post("http://localhost:5000/post", {
        userName: userName,

        sender: email,
        msgs: msg,
        //roomno: rno,
        invitecode: cp,
        time: new Date().getTime(),
      });
      //console.log("after posting chat");
      socket.emit("send", {
        msgs: msg,
        sender: email,
        invitecode: cp,
        userName: userName,
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
    //socket.current.emit()
    //console.log("initialised socket");
    let roomsocket = (data) => {
      console.log(data);
      console.log(cp);
      if (data.invitecode === cp) {
        console.log("yeah matched");

        setrecieved((prev) => [...prev, data]);
      }
    };
    socket.on("text", roomsocket);
    let usersocket = (data) => {
      setrecieved((prev) => [...prev, data]);
    };
    socket.on("userjoin", usersocket);
    let leave = (data) => {
      console.log("leaving");
      setrecieved((prev) => [...prev, data]);
    };
    socket.on("leave", leave);
    return () => {
      console.log("cleaned");
      socket.off("text", roomsocket);
      socket.off("userjoin", usersocket);
      socket.off("leave", leave);
    };
  }, [cp]);
  console.log(recieved);
  useEffect(() => {
    //setsubrecent(recent2)
    let initialdata = async () => {
      console.log(cp);
      //console.log(recent2);
      try {
        let status = await axios.post("http://localhost:5000/data", {
          invitecode: cp,
        });
        //.then((res) => res.data);
        //console.log(recent2);
        console.log(status);
        setrecieved(status.data[0].chat);
        setroompic(status.data[0].roompic);
      } catch (err) {
        console.log(err);
      }
    };
    initialdata();
    setmsg("");
  }, [cp]);
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

  let leaveRoom = async () => {
    handleClose();
    let userName = localStorage.getItem(`${email}username`);
    let res = await axios.post("http://localhost:5000/leave", {
      email: email,
      invitecode: cp,
      userName: userName,
    });
    console.log(res)
    setcp("");
    initialfetch();
  };
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  let handledel = async () => {
    console.log("reached del");
    handleClose();
    let res = "";
    try {
      res = await axios.delete("http://localhost:5000/delete", {
        data: {
          invitecode: cp,
          email: email,
        },
      });
      setcp("");
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
    <Box id="msgside">
      <CssBaseline />
      <AppBar
        position="sticky"
        style={{ backgroundColor: "rgb(98, 157, 252)" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            style={{ marginRight: "0" }}
            onClick={() => setcp("")}
          >
            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
          </IconButton>
          <Box className="d-flex justify-content-between" style={{ flex: "1" }}>
            <Box className="d-flex">
              <Typography variant="h6" component="div">
                <img
                  src={roompic !== undefined ? roompic : Dummy}
                  //alt="txt"
                  className="dummyimg"
                  style={{ marginTop: "0" }}
                ></img>
              </Typography>
              <Typography
                variant="h6"
                component="div"
                className="ScrollTop-header-roomno"
              >
                {rno}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={handleClick}>
                <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
              </IconButton>
            </Box>
          </Box>
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
                <input
                  type="file"
                  className="custom-file-input"
                  onChange={picupload}
                ></input>
              </ul>
            </Typography>
          </Popover>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
        <Box sx={{ my: 2 }}>
          <Box className="d-flex flex-column chatdiv">
            {recieved.map((msg, index) => {
              if (msg.txt !== undefined) {
                return (
                  <div>
                    <p>{msg.txt}</p>
                  </div>
                );
              } else if (msg.sender === email) {
                return (
                  <div
                    key={index}
                    style={{
                      alignSelf: "flex-end",
                      //backgroundColor: "#931bf5",
                      backgroundColor: "#629dfc",
                      color: "white",
                      padding: 10,
                      borderRadius: 8,
                    }}
                    className="Chatroom-chats"
                  >
                    <p>{msg.msgs}</p>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "#f3f0f5",
                      padding: 10,
                      borderRadius: 8,
                    }}
                    className="Chatroom-chats"
                  >
                    <p className="Scrolltop-Username">{msg.userName}</p>
                    <p>{msg.msgs}</p>
                  </div>
                );
              }
            })}
          </Box>
          <div
            style={{
              position: "sticky",
              bottom: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="Chatroom-chats"
          >
            <input value={msg} onChange={setmymsg} id="inpbox"></input>
            <FontAwesomeIcon
              icon={faPaperPlane}
              onClick={sendmsg}
              className="sendbtn"
            ></FontAwesomeIcon>
          </div>
        </Box>
      </Container>
      <Top {...props}>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <FontAwesomeIcon icon={faArrowAltCircleUp}></FontAwesomeIcon>
        </Fab>
      </Top>
    </Box>
  );
}
