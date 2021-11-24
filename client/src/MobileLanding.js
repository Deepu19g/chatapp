import { React, useState, useEffect, useRef } from "react";
import {
  Route,
  Routes,
  //BrowserRouter as Router,
  useNavigate,
  
} from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Dummy from "./assets/dummyimage.jpg";
//import Chatroom from "./Chatroom";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import querystring from "query-string";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, Box, Button } from "@mui/material";
import "./MobileLanding.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

import "./ChatLanding.css";
import Popover from "@mui/material/Popover";
import EventModal from "./Components/EventModal";

function MobileLanding({ email }) {
  const [roomno, setroomno] = useState("");
  //const { path, url } = useRouteMatch();
  const [val, setval] = useState([]);
  const [recent, setrecent] = useState("");
  const [sortarr, setsortarr] = useState([]);
  const [refresh, setrefresh] = useState("");
  const [invite, setinvite] = useState("");
  const socket = useRef();
  const navigate= useNavigate();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const [Open, setOpen] = useState(false);
  const [cp, setcp] = useState("");
  const [rno, setrno] = useState("");
  const [mode, setmode] = useState();
  const handleClose = () => setOpen(false);
  const [anchorEl, setAnchorEl] = useState(null);

  let invitechange = (e) => {
    setinvite(e.target.value);
  };

  useEffect(() => {
    //func to find rooms associated wuth a user
    console.log(typeof localStorage.getItem(`loggedin${email}`));
    console.log(localStorage.getItem(`loggedin${email}`) == "false");
    if (localStorage.getItem(`loggedin${email}`) == "false") {
      console.log("reached back");

     navigate(-1);
    } else {
      console.log("reached load fetch");
      initialfetch();
    }
    return () => {
      source.cancel("async func canceled");
    };
  }, []);
  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("text", (data) => {
      console.log("broadcast msg receieved");
      initialfetch();
    });
    socket.current.on("deleted", () => {
      console.log("delete recieved");
      initialfetch();
    });
    socket.current.emit("initialjoin", { email });
    return () => {
      source.cancel("async func canceled");
      socket.current.close();
      console.log("socket closed mland");
    };
  }, []); //TODO: reinitialize socket on user change

  const handleclose = () => {
    setAnchorEl(null);
  };

  let initialfetch = async () => {
    console.log("initial fetched");
    let jwtoken = localStorage.getItem(`jwt${email}`);
    //console.log(jwtoken)
    let config = {
      headers: {
        Authorization: "Bearer" + " " + jwtoken,
      },
      cancelToken: source.token,
    };
    try {
      const res = await axios
        .post(
          "http://localhost:5000/recents",
          {
            email: email,
          },
          config
        )
        .then((val) => val.data);
      console.log(res);
      setval(res);
      //setval(res.reverse());
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(err);
      } else {
        navigate(-1)
      }
    }
  };
  
  let clickrecents = (inv,roomno) => {
    //setcp(e.invitecode);
    //setrno(e.roomno);
    //console.log(typeof socket.current)
    //console.log(email)
    /*history.push({
      pathname: `/chats`,
      state: {
        text:"txt"
        /*data: { 
          //
         
         },

        

    });*/
    navigate(
       "/chats",
     // search: '?query=abc',
     { state: {email: email, cp: inv, rno: roomno,user:localStorage.getItem(`${email}username`)} }
  );
  };
  console.log(recent);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  let joinclick = () => {
    setmode("join");
    setOpen(true);

    handleclose();
  };
  let createclick = () => {
    setmode("create");
    setOpen(true);

    handleclose();
  };

  let eventprops = {
    mode: mode,
    roomno: roomno,
    setroomno: setroomno,
    invite: invite,
    invitechange: invitechange,
    initialfetch: initialfetch,
    email: email,
    setinvite: setinvite,
    socket: socket,
    Open: Open,
    setOpen: setOpen,
    //create:createRoom,
    //sub:submit,
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="mob-top">
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ overflowY: "scroll", minHeight: "100vh" }}>
          <Box className="ChatLanding-popicon">
            <IconButton onClick={handleClick}>
              <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
            </IconButton>
          </Box>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleclose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography sx={{ p: 2 }} component={"div"}>
              {" "}
              <ul>
                <p onClick={joinclick}>Join Room</p>
                <p onClick={createclick}>Create Room</p>
              </ul>
            </Typography>
          </Popover>
          {mode !== undefined ? (
            <EventModal {...eventprops}></EventModal>
          ) : (
            <Box></Box>
          )}
          <Box className="mob-top">
            {val.map((itm, index) => {
              return (
                <div
                  key={index}
                  id="roomnames"
                  onClick={() => clickrecents(itm.invitecode,itm.roomno)}
                  className="d-flex  align-items-center"
                >
                  <img src={Dummy} alt="img" className="dummyimg"></img>
                  
                  <Box>
                <p className="dummyimgtxt">{itm.roomno}</p>
                {(itm.msgs) ? (<p className="ChatLanding-mutedtxt">{itm.user}:{itm.msgs}</p>):('')}
                </Box>
                </div>
              );
            })}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default MobileLanding;
