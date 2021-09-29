import { React, useState, useEffect, useRef } from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import Chatroom from "./Chatroom";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import querystring from "query-string";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Grid, Box, Button } from "@mui/material";
import "./MobileLanding.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./ChatLanding.css";
function MobileLanding({ email }) {
  const [roomno, setroomno] = useState("");
  const { path, url } = useRouteMatch();
  const [val, setval] = useState([]);
  const [recent, setrecent] = useState("");
  const [sortarr, setsortarr] = useState([]);
  const [refresh, setrefresh] = useState("");
  const [invite, setinvite] = useState("");
  const socket = useRef();
  const history = useHistory();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  const [open, setOpen] = useState(false);
  const [cp, setcp] = useState("");
  const [rno, setrno] = useState("");

  const handleClose = () => setOpen(false);
  let submit = async () => {
    let res = {};
    try {
      res = await axios.post("http://localhost:5000/roomjoin", {
        invite: invite,
        members: email,
      });
      //setrecent(res.data);

      initialfetch();

      socket.current.emit("join", { no: res.data, email: email });
      setinvite(" ");
      console.log(res.data);
    } catch (err) {
      alert(err.response.data);
    }
    //if such a username already exists deal with it later
  };

  let createRoom = async () => {
    try {
      let res = await axios.post("http://localhost:5000/roomcreate", {
        roomno: roomno,
        members: email,
        time: new Date().getTime(),
      });
      setOpen(false);
      initialfetch();

      socket.current.emit("join", { no: res.data.invitecode, email: email });
    } catch (err) {
      alert(err.response.data);
    }
  };

  let invitechange = (e) => {
    setinvite(e.target.value);
  };

  useEffect(() => {
    //func to find rooms associated wuth a user
    console.log(typeof localStorage.getItem(`loggedin${email}`));
    console.log(localStorage.getItem(`loggedin${email}`) == "false");
    if (localStorage.getItem(`loggedin${email}`) == "false") {
      console.log("reached back");

      history.goBack();
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
      initialfetch();
    });
    socket.current.emit("initialjoin", { email });
    return () => {
      source.cancel("async func canceled");
      socket.current.close();
      console.log("socket closed mland");
    };
  }, []); //TODO: reinitialize socket on user change

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
        history.goBack();
      }
    }
  };
  console.log(path);
  let clickrecents = (e) => {
    setcp(e.invitecode);
    setrno(e.roomno);
    //console.log(typeof socket.current)
    let obj = {
      data: {
        email: email,
        cp: e.invitecode,
        rno: e.roomno,
        //socket: String(socket.current),
      },
    };

    history.push({ pathname: `${url}/chats`, state: obj });
  };
  console.log(recent);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ overflowY: "scroll", minHeight: "100vh" }}>
          <p>Join Room</p>
          <p>Room no:</p>
          <input
            value={invite}
            onChange={invitechange}
            name="room"
            type="text"
          ></input>
          <button onClick={submit}>Submit</button>

          <Button onClick={() => setOpen(true)}>Create</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box id="mdlstyle">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <input
                  value={roomno}
                  onChange={(e) => setroomno(e.target.value)}
                ></input>
                <button onClick={createRoom}>Create</button>
              </Typography>
            </Box>
          </Modal>

          {val.map((itm, index) => {
            return (
              <div
                key={index}
                id="roomnames"
                onClick={() => clickrecents(itm._id)}
                className="d-flex justify-content-between align-items-center"
              >
                <p>{itm._id.roomno}</p>
              </div>
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );
}

export default MobileLanding;
