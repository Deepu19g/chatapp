import React,{useState} from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import {
  faEllipsisV,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Box from "@mui/material/Box";
import Dummy from "../assets/dummyimage.jpg";
import AddmemModal from "./AddmemModal/AddmemModal";

function RoomNav({ id, open, anchorEl, handleClose,navigate,roomdp,cp,email,setopenAddmem,rno,handleClick2,openAddmem,setcp }) {
  const [roompic, setroompic] = useState(roomdp);

  let picupload = async (e) => {
    handleClose();
    let files = e.target.files;

    if (files[0] !== undefined) {
      let fdata = new FormData();
      fdata.append("file", files[0]);
      fdata.append("upload_preset", "nvjz6yfm");
      let imgresult = await axios.post(
        "https://api.cloudinary.com/v1_1/dlosbkrhb/image/upload",
        fdata
      );

      await axios.post("http://localhost:5000/room/roompic", {
        url: imgresult.data.secure_url,
        invite: cp,
        email: email,
      });
      setroompic(imgresult.data.secure_url);
    }
  };

  let addmember = async () => {
    setopenAddmem(true);
  };

  let leaveRoom = async () => {
    let res = await axios.post("http://localhost:5000/room/leave", {
      email: email,
      invitecode: cp,
    });
    //setcp("");

    window.innerWidth<600 ? navigate(-1):setcp("");
  };

  let handledel = async () => {
    console.log("reached del");
    let res = "";
    try {
      res = await axios.delete("http://localhost:5000/room/delete", {
        data: {
          invitecode: cp,
          email: email,
        },
      });

      navigate(-1);
    } catch (err) {
      if (err.response) {
        alert(err.response.data.msg);
      }

      console.log(err.response.data);
    }
  };

  return (
    <div style={{position:"relative"}}>
     
      <CssBaseline />
      <AppBar style={{ backgroundColor: "#23a0e8",position:"absolute" }} className="Mobchat-nav">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => navigate(-1)}
            style={{ marginRight: "0" }}
          >
            <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
          </IconButton>
          <Box className="d-flex justify-content-between" style={{ flex: "1" }}>
            <Box className="d-flex">
              <Typography variant="h6" component="div">
                {console.log(roompic)}
                <img
                  src={roompic !== undefined ? roompic : Dummy}
                  //alt="txt"
                  className="dummyimg-mob"
                  style={{ marginTop: "0" }}
                ></img>
              </Typography>
              <Typography
                variant="h6"
                component="div"
                className="ScrollTop-header-roomno"
              >
                {rno}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={handleClick2} style={{ marginRight: "0" }}>
                <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
              </IconButton>
            </Box>
          </Box>
          {/*<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
         <p className="Mobchatroom-msgs" style={{ marginBottom: "0" }}>
           {rno}
         </p>
         </Typography>*/}

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography sx={{ p: 2 }} component={"div"}>
              <ul id="popul">
                <p onClick={leaveRoom}>Leave Room</p>
                <p onClick={handledel}>Delete Room</p>
                <p onClick={addmember}>Add member</p>
                <input
                  type="file"
                  className="custom-file-input"
                  onChange={picupload}
                ></input>
              </ul>
            </Typography>
          </Popover>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <AddmemModal
        Open={openAddmem}
        setopenAddmem={setopenAddmem}
        rno={rno}
        invitecode={cp}
      ></AddmemModal>
    </div>
  );
}

export default RoomNav;
