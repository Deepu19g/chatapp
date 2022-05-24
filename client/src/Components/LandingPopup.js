import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

function LandingPopup({
  setOpen,
  setAnchorEl,
  anchorEl,
  setmode,
  navigate,
  email,
}) {
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleclose = () => {
    setAnchorEl(null);
  };

  let logout = () => {
    navigate(-1);
    localStorage.setItem(`loggedin${email}`, "false");
  };

  let joinclick = () => {
    //function on clicking join btn
    setmode("join");
    setOpen(true);
    handleclose();
  };

  let createclick = () => {
    setmode("create");
    setOpen(true);

    handleclose();
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleclose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Typography sx={{ p: 2 }} component={"div"}>
        {" "}
        <ul>
          <p onClick={joinclick}>Join Room</p>
          <p onClick={createclick}>Create Room</p>
          <p onClick={logout}>Logout</p>
        </ul>
      </Typography>
    </Popover>
  );
}

export default LandingPopup;
