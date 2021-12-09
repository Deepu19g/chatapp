import { React, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import axios from "axios";
function EventModal({ modtxt, modeval, modefunc, setmodeval, btntxt,Open,setOpen }) {
  //const [open, setopen] = useState(Open);
  
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
  return (
    <Box>
      <Modal
        open={Open}
        onClose={()=>setOpen(!Open)}
        //onClose={console.log("closed")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <p>{modtxt}</p>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <input
              value={modeval}
              onChange={(e) => setmodeval(e.target.value)}
            ></input>

            <button onClick={modefunc}>{btntxt}</button>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );

  /*if (mode == "create") {
   
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
  } else if(mode=="addmem"){

  }*/
}

export default EventModal;
