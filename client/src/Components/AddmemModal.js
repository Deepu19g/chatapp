import React from "react";


import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Modal from "@mui/material/Modal";
import axios from "axios";



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

export default function AddmemModal({Open,userprop}) {
  const [open, setOpen] = React.useState(Open);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
     
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ display: "flex" }}>
            {
                userprop.map((itm,index)=>{
                    <Box key={index}>{itm.username}</Box>
                })
            }
        </Box>
      </Modal>
    </div>
  );
}
