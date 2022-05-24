import React, { useState, useRef, useEffect } from "react";
import "./MobileChat.css";

import PropTypes from "prop-types";

                                           

import Typography from "@mui/material/Typography";

import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Fab from "@mui/material/Fab";

import Zoom from "@mui/material/Zoom";
import Mobilechatroom from "../Mobilechatroom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleUp,
  
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

import RoomNav from "./RoomNav";

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
  
  const [openAddmem, setopenAddmem] = useState(false);
  const [mode, setmode] = useState(" ");

  const toggle = () => setPopoverOpen(!popoverOpen);
  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  

  

  let propsRoomPopup = {
    //props to pass to RoomNav component
    id: id,
    open: open,
    anchorEl: anchorEl,
    handleClose: handleClose,
    navigate:navigate,
    roomdp:roomdp,
    cp:cp,
    email:email,
    setopenAddmem:setopenAddmem,
    rno:rno,
    handleClick2:handleClick2,
    openAddmem:openAddmem,
  };

  return (
    <React.Fragment>
     <RoomNav {...propsRoomPopup}></RoomNav>
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
