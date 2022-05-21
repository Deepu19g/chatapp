import React, { useState, useRef, useEffect } from "react";
import "./MobileChat.css";
import axios from "axios";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Zoom from "@mui/material/Zoom";
import Mobilechatroom from "../Mobilechatroom";
import AddmemModal from "./AddmemModal/AddmemModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleUp,
  faEllipsisV,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import Dummy from "../assets/dummyimage.jpg";

function ScrollTop(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#back-to-top-anchor"
    );

    if (anchor) {
      anchor.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      >
        {children}
      </Box>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function Mobilechat() {
  const location = useLocation();
  console.log(location);
  const navigate = useNavigate();

  let { email, cp, rno, roomdp } = location.state;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [roompic, setroompic] = useState(roomdp);
  const [mode, setmode] = useState(" ");
 
  const [openAddmem,setopenAddmem] = useState(false)
  const toggle = () => setPopoverOpen(!popoverOpen);
  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  let leaveRoom = async () => {
    let res = await axios.post("http://localhost:5000/leave", {
      email: email,
      invitecode: cp,
    });
    navigate(-1);
  };

  let handledel = async () => {
    console.log("reached del");
    let res = "";
    try {
      res = await axios.delete("http://localhost:5000/delete", {
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

      await axios.post("http://localhost:5000/roompic", {
        url: imgresult.data.secure_url,
        invite: cp,
        email: email,
      });
      setroompic(imgresult.data.secure_url);
    }
  };

  let addmember = async () => {
    setopenAddmem(true)
    
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar style={{ backgroundColor: "#23a0e8" }} className="Mobchat-nav">
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
    
      <AddmemModal  Open={openAddmem} setopenAddmem={setopenAddmem} rno={rno} invitecode={cp}></AddmemModal>
      <Container>
        <Box sx={{ my: 2 }}>
          <Mobilechatroom location={location}></Mobilechatroom>
        </Box>
      </Container>
      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <FontAwesomeIcon icon={faArrowAltCircleUp}></FontAwesomeIcon>
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
