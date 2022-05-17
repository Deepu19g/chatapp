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

  const [invite, setinvite] = useState("");
  const socket = useRef();
  const navigate = useNavigate();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const [Open,setOpen] = useState(false)
  const [cp, setcp] = useState("");
  const [rno, setrno] = useState("");
const [eventmodprop,seteventmodprop] = useState({})
  const [anchorEl, setAnchorEl] = useState(null);
 
  let invitechange = (e) => {
    setinvite(e.target.value);
  };
console.log(Open)
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
        navigate(-1);
      }
    }
  };

  let clickrecents = (inv, roomno, roompic) => {
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
      {
        state: {
          email: email,
          cp: inv,
          rno: roomno,
          user: localStorage.getItem(`${email}username`),
          roomdp: roompic,
        },
      }
    );
  };
  

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //props to pass to EventModal comp

  let joinclick = () => {//function on clicking join btn
    setOpen(true)
   seteventmodprop({
      
      modeval: invite,
      modefunc: submit,
      modtxt: "Join Room",
      setmodeval: invitechange,
      btntxt: "Join",
      
     setOpen:setOpen
      
    });
    handleclose();
  };
  let createclick = () => {
    setOpen(true)
    seteventmodprop({
      //props to pass to EventModal comp
      modeval: roomno,
      modefunc: createRoom,
      modtxt: "Create Room",
      setmodeval: setroomno,
      btntxt: "Create",
      
     setOpen:setOpen
    });
    //setOpen(true);

    handleclose();
  };

  let createRoom = async () => {
    try {
      let res = await axios.post("http://localhost:5000/roomcreate", {
        roomno: roomno,
        members: email,
        time: new Date().getTime(),
      });

      setOpen(false)
      //socket.current.on("roomcreated",{})
      console.log(res.data.invitecode);
      socket.current.emit("join", { no: res.data.invitecode, email: email });
      setval([res.data.room,...val])

    } catch (err) {
      alert(err.response.data);
    }
  };

  let submit = async () => {
    let res = {};
    try {
      res = await axios.post("http://localhost:5000/roomjoin", {
        invite: invite,
        members: email,
      });
      //setrecent(res.data);
      setOpen(false)
      initialfetch();
      socket.current.emit("join", { no: res.data, email: email });
      setinvite(" ");
      console.log(res.data);
    } catch (err) {
      alert(err.response.data);
    }
    //if such a username already exists deal with it later
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

          <EventModal {...eventmodprop} Open={Open}></EventModal>

          <Box className="mob-top">
            {val.map((itm, index) => {
              return (
                <div
                  key={index}
                  id="roomnames"
                  onClick={() =>
                    clickrecents(itm.invitecode, itm.roomno, itm.roompic)
                  }
                  className="d-flex  align-items-center"
                >
                  <img
                    src={itm.roompic !== undefined ? itm.roompic : Dummy}
                    alt="img"
                    className="dummyimg"
                  ></img>

                  <Box>
                    <p className="dummyimgtxt">{itm.roomno}</p>

                    {itm.chat.at(-1) !== undefined ? (
                      <p className="ChatLanding-mutedtxt">
                        {itm.chat.at(-1).userName}:{itm.chat.at(-1).msgs}
                      </p>
                    ) : (
                      ""
                    )}
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
