import { React, useState,useEffect } from "react";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import axios from "axios";
function EventModal({
  mode,
  roomno,
  setroomno,
  initialfetch,
  invite,
  invitechange,
  email,
  setinvite,
  Open,
  setOpen,
  socket,
}) {
  

 
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
  console.log(Open)
  let submit = async () => {
    let res = {};
    try {
      res = await axios.post("http://localhost:5000/roomjoin", {
        invite: invite,
        members: email,
      });
      //setrecent(res.data);
      setOpen(false);
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
      console.log(res.data.invitecode);
      socket.current.emit("join", { no: res.data.invitecode, email: email });
    } catch (err) {
      alert(err.response.data);
    }
  };

  if (mode == "create") {
   
    return (
      <Box>
        <Modal
          open={Open}
          onClose={()=>setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <p>Create Room</p>
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
      </Box>
    );
  } else if (mode == "join") {
    
    return (
      <Box>
        <Modal
          open={Open}
          onClose={()=>setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <p>Join Room</p>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <input value={invite} onChange={invitechange}></input>

              <button onClick={submit}>Join</button>
            </Typography>
          </Box>
        </Modal>
      </Box>
    );
  } 
}

export default EventModal;
