import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chatroom.css";
import Popover from "@mui/material/Popover";
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
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const [msg, setmsg] = useState("");
  const [recieved, setrecieved] = useState([]);

  //const [subrecent,setsubrecent] = useState(recent2)
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
      socket.emit("send", { msgs: msg, sender: email, invitecode: cp });
    } catch (e) {
      console.log(e);
    }

    setmsg("");
  };
  //get previous chats

  const setmymsg = (e) => setmsg(e.target.value);
  //console.log(username);
  console.log(cp);
  useEffect(() => {
    //socket.current.emit()
    console.log("initialised socket");
    const roomsocket = socket.on("text", (data) => {
      console.log(data.msgs);

      if (data.invitecode === cp) {
        console.log("yeah matched");

        setrecieved((prev) => [...prev, data]);
      }
    });
    return () => socket.off("text", roomsocket);
  }, [cp]);

  useEffect(() => {
    //setsubrecent(recent2)
    let initialdata = async () => {
      //setrecieved([]);
      console.log("initialdata called");
      //console.log(recent2);
      try {
        let status = await axios.post("http://localhost:5000/data", {
          invitecode: cp,
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
    let res = await axios.post("http://localhost:5000/leave", {
      email: email,
      invitecode: cp,
    });
    setcp("");
    initialfetch();
  };
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = () => setPopoverOpen(!popoverOpen);

  let handledel = async () => {
    console.log("reached del");
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
      <AppBar position="sticky" style={{ backgroundColor: "#23a0e8" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setcp("")}
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
      <Toolbar id="back-to-top-anchor" />
      <Container>
        <Box sx={{ my: 2 }}>
          <Box className="d-flex flex-column chatdiv">
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
          </Box>
          <div
            style={{
              position: "sticky",
              bottom: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
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
