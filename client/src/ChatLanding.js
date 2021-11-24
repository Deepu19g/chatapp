import { React, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { io } from "socket.io-client";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Grid, Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import "./ChatLanding.css";
import BackToTop from "./ScrollTop";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Dummy from "./assets/dummyimage.jpg";
import EventModal from "./Components/EventModal";
import {Image} from 'cloudinary-react';

function ChatLanding({ email }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [roomno, setroomno] = useState("");
  const [invite, setinvite] = useState("");
  const [rno, setrno] = useState("");
  //const { path, url } = useRouteMatch();
  const [val, setval] = useState([]);
  const [recent, setrecent] = useState("");
  const [mode, setmode] = useState();
  const [cp, setcp] = useState("");
  const socket = useRef();
  const navigate = useNavigate();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
//const [dp,setdp] = useState(" ")
  const [Open, setOpen] = useState(false);

  /*const roomnochange = (e) => {
    setroomno(e.target.value);
  };*/

  useEffect(() => {
    if (localStorage.getItem(`loggedin${email}`) == "false") {
      navigate(-1);
    } else {
      initialfetch();
    }
    return () => {
      source.cancel("async func canceled");
    };
  }, []);
  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("text", (data) => {
      //console.log("broadcast msg receieved");
      //setval()
      initialfetch();
    });
    socket.current.on("deleted", () => {
      console.log("deleted");
      setcp("");
      initialfetch();
    });
    socket.current.emit("initialjoin", { email });
    return () => {
      source.cancel("async func canceled");
      socket.current.close();
    };
  }, []); //TODO: reinitialize socket on user change

  
  let initialfetch = async () => {
    let jwtoken = localStorage.getItem(`jwt${email}`);
console.log(jwtoken)
    let config = {
      headers: {
        Authorization: "Bearer" + " " + jwtoken,
      },
      cancelToken: source.token,
    };
    try {
      let res = await axios
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
        console.log(err)
      navigate(-1);
      }
      //
    }
  };

  const clickrecents = (invite, roomno) => {
    //setrecent(e.currentTarget.textContent);
    setcp(invite);
    setrno(roomno);
  };

  let invitechange = (e) => {
    setinvite(e.target.value);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleclose = () => {
    setAnchorEl(null);
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid
          item
          lg={3}
          md={4}
          xs={5}
          style={{ overflowY: "scroll", minHeight: "100vh" }}
        >
          {/*<input
            value={invite}
            onChange={invitechange}
            name="room"
            type="text"
          ></input>
          <button onClick={submit}>Submit</button>

         
          <AddCircleIcon
            className="plusbuttonmain"
            onClick={() => setOpen(true)}
          ></AddCircleIcon>*/}
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
          {val.map((itm, index) => {
           // console.log(itm.chat.at(-1).userName)
            return (
              <div
                key={index}
                id="roomnames"
                onClick={() => clickrecents(itm.invitecode, itm.roomno)}
                className="d-flex align-items-center"
              >
                <img src={(itm.roompic!==undefined) ? itm.roompic:Dummy} alt="img" className="dummyimg"></img>
                <Box>
                  <p className="dummyimgtxt">{itm.roomno}</p>
                  {(itm.chat.at(-1)!==undefined )? (
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
        </Grid>
        <Grid
          item
          lg={9}
          md={8}
          xs={7}
          style={{ paddingLeft: "0", overflowY: "scroll" }}
        >
          {cp !== "" && (
            <BackToTop
              socket={socket.current}
              cp={cp}
              //user={user}
              email={email}
              setcp={setcp}
              initialfetch={initialfetch}
              rno={rno}
            ></BackToTop>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatLanding;
