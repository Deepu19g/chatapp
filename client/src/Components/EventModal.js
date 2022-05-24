import { React, useState } from "react";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import axios from "axios";
import "./EventModal.css"
import Button from "@mui/material/Button";

import SendIcon from "@mui/icons-material/Send";

function EventModal({
  roomno,setroomno,setinvite,invite,
  mode,
  val,setval,
  btntxt,
  Open,
  setOpen,
  email,
  initialfetch,
  socket
}) {
  //const [open, setopen] = useStateOpen);

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
  console.log(Open);

  let joinRoom = async () => {
    let userName = localStorage.getItem(`${email}username`);
    try {
      setOpen(!Open);
      await axios.post("http://localhost:5000/room/roomjoin", {
        invite: invite,
        members: [email],
        userName: userName,
      });
      initialfetch();
      socket.current.emit("join", { no: invite });
    } catch (err) {
      console.log(err);
    }
  };

  let createRoom = async () => {
    try {
      let res = await axios.post("http://localhost:5000/room/roomcreate", {
        roomno: roomno,
        members: email,
        time: new Date().getTime(),
      });

      setOpen(false);
      //socket.current.on("roomcreated",{})
      console.log(res.data.invitecode);
      socket.current.emit("join", { no: res.data.invitecode, email: email });
      setval([res.data.room, ...val]);
      setroomno("");
    } catch (err) {
      alert(err.response);
    }
  }

  return (
    <Box>
      <Modal
        open={Open}
        onClose={() => setOpen(!Open)}
        //onClose={console.log("closed")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {mode == "join" ? <p>Join Room</p> : <p>Create Room</p>}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} style={{display:"flex",justifyContent:"space-around"}}>
            <input
              value={ mode === "create" ? roomno:invite}
              className="EventModal-model"
              onChange={(e) => mode === "create" ? setroomno(e.target.value):setinvite(e.target.value)}
            ></input>
            <Button
              variant="outlined"
              endIcon={<SendIcon />}
              onClick={mode === "create" ? createRoom:joinRoom}
              style={{ color: "black", borderColor: "black" }}
            >
              Submit
            </Button>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );

  
}

export default EventModal;
