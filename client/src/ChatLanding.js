import { React, useState, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";

import { io } from "socket.io-client";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Grid, Box, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import "./ChatLanding.css";
import BackToTop from "./ScrollTop";
function ChatLanding({ email }) {
  const [roomno, setroomno] = useState("");
  const [invite, setinvite] = useState("");
  const [rno, setrno] = useState("");
  //const { path, url } = useRouteMatch();
  const [val, setval] = useState([]);
  const [recent, setrecent] = useState("");
  const [open, setOpen] = useState(false);
  const [cp, setcp] = useState("");
  const socket = useRef();
  const history = useHistory();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const roomnochange = (e) => {
    setroomno(e.target.value);
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (localStorage.getItem(`loggedin${email}`) == "false") {
      history.goBack();
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
      console.log("broadcast msg receieved");
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
      //console.log(err)
    }
  };

  const clickrecents = (e) => {
    //setrecent(e.currentTarget.textContent);
    setcp(e.invitecode);
    setrno(e.roomno);
    console.log(e);
  };

  let invitechange = (e) => {
    setinvite(e.target.value);
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
      console.log(res.data.invitecode);
      socket.current.emit("join", { no: res.data.invitecode, email: email });
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={3} style={{ overflowY: "scroll", minHeight: "100vh" }}>
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
            <Box sx={style}>
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
        <Grid item xs={9} style={{ paddingLeft: "0", overflowY: "scroll" }}>
          {cp !== "" && (
            <BackToTop
              socket={socket.current}
              cp={cp}
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
