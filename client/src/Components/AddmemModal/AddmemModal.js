import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Modal from "@mui/material/Modal";
import axios from "axios";
import "./AddmemModal.css";
import Checkbox from "@mui/material/Checkbox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  //width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function AddmemModal({ Open, setopenAddmem, rno,invitecode }) {
  const [userdata, setuserdata] = useState([]);
  const [username, setusername] = useState("");

  const [checked, setchecked] = useState([]);
  const handleClose = () => setopenAddmem(false);
  useEffect(() => {
    try {
      axios.post("http://localhost:5000/user/userlist",{
        invite:invitecode
      }).then((res) => {
        setuserdata(res.data.userlist);
        var arr = Array(res.data.userlist.length).fill(false);
        setchecked(arr);
      });
    } catch (err) {
      console.log(err);
    }
  }, []);
  

  let addusertoroom = async (submittedusers) => {
    //works when user selects a username to add to room
    try {
      axios.post("http://localhost:5000/user/roomjoin", {
       members: submittedusers,
        invite: invitecode,
      });
    } catch (err) {
      console.log(err);
    }
  };

  let handleCheck = (index) => {
    setchecked((prev) => prev.map((itm, i) => (i == index ? !itm : itm)));
  };
  let handlesubmit = async(e) => {
    e.preventDefault()
    handleClose()
    let submittedusers=[]
    checked.map((itm, i) => {
      if (itm == true) {
        submittedusers=[...submittedusers,userdata[i]]
      }
    });
    addusertoroom(submittedusers)
    
  };
  return (
    <div>
      <Modal
        open={Open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handlesubmit} >
          <Box sx={style} className="AddmemModal-maindiv">
            <Box style={{overflow:"scroll",height:"90%"}}>
            {userdata.map((itm, index) => {
              return (
                <Box
                  key={index}
                  className="AddmemModal-subdiv d-flex justify-content-between align-items-center"
                  onClick={() => setusername(itm)}
                >
                  {itm.length >15 ? itm.substr(0,15)+"...":itm}
                  <Checkbox
                    checked={checked[index]}
                    onChange={() => handleCheck(index)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>
              );
            })}
            </Box>
            <Button type="submit" variant="contained">Add</Button>
          </Box>
        </form>
      </Modal>
    </div>
  );
}
