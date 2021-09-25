import { React, useState, useEffect, useRef } from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  useHistory,
  useRouteMatch,
} from "react-router-dom";
import Chatroom from "./Chatroom";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import querystring from "query-string";
import axios from "axios";

import {Grid,Box} from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./ChatLanding.css";
function MobileLanding({ email }) {
  const [roomno, setroomno] = useState("");
  const { path, url } = useRouteMatch();
  const [val, setval] = useState([]);
  const [recent, setrecent] = useState("");
  const [sortarr, setsortarr] = useState([]);
  const [refresh, setrefresh] = useState("");
  const socket = useRef();
  const history = useHistory();
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  let submit = async () => {
    console.log("recent backdoor");

    const res = await axios.post("http://localhost:5000/roomdata", {
      members: email,
      time: new Date().getTime(),
      roomno: roomno,
    });
    setrecent(roomno);
    initialfetch();
    socket.current.emit("join", { no: roomno, email: email });
    setroomno(" "); //if such a username already exists deal with it later
  };

  const roomnochange = (e) => {
    setroomno(e.target.value);
  };

  

  useEffect(() => {
    //func to find rooms associated wuth a user
    console.log(typeof localStorage.getItem(`loggedin${email}`));
    console.log(localStorage.getItem(`loggedin${email}`) == "false");
    if (localStorage.getItem(`loggedin${email}`) == "false") {
      console.log("reached back");

      history.goBack();
    } else {
      console.log("reached load fetch");
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
    socket.current.on("deleted",()=>{
      initialfetch()
    })
    socket.current.emit("initialjoin", { email });
    return () => {
      source.cancel("async func canceled");
      socket.current.close();
    };
  }, []); //TODO: reinitialize socket on user change

  let initialfetch = async () => {
    console.log("initial fetched");
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
      if(axios.isCancel(err)){
        console.log(err)
      }else{
        history.goBack();
      }
     
    }
  };
  console.log(path);
  let clickrecents = (e) => {
    setrecent(e.currentTarget.textContent);
    console.log(socket.current);
    let obj = {
      email: email,
      recent2: e.currentTarget.textContent,
    };

    history.push({
      pathname: `${url}/chats`,
      state: obj,
    });
  };
  console.log(recent);
  return (
    <Box sx={{ flexGrow: 1 }}>
     
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ overflowY: "scroll" ,minHeight:"100vh"}} >
          <p>Join Room</p>
          <p>Room no:</p>
          <input
            value={roomno}
            onChange={roomnochange}
            name="room"
            type="text"
          ></input>
          <button onClick={submit}>Submit</button>

          {val.map((itm, index) => {
            return (
              <div
                key={index}
                id="roomnames"
                onClick={clickrecents}
                className="d-flex justify-content-between align-items-center"
              >
                <p>{itm._id}</p>
              </div>
            );
          })}
        </Grid>
       
      </Grid>
    </Box>
  );
}

export default MobileLanding;
