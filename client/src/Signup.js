import { React, useState, useEffect, useRef } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Chatroom from "./Chatroom";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import querystring from "query-string";

function Signup() {
  const [username, setusername] = useState("");
  const [roomno, setroomno] = useState(0);
  const socket = useRef();
  const submit = (e) => {
    console.log("reached");
    socket.current.emit("join", { no: roomno, user: username }); //if such a username already exists deal with it later
  };
  const handlenamechange = (e) => {
    setusername(e.target.value);
  };
  const roomnochange = (e) => {
    setroomno(e.target.value);
  };

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    console.log(username);
    return () => socket.current.close();
  }, []); //TODO: reinitialize socket on user change

  return (
    <div>
      <div>
        <p>Username:</p>
        <input
          type="text"
          value={username}
          onChange={handlenamechange}
          name="user"
        ></input>
        <p>Room no:</p>
        <input
          value={roomno}
          onChange={roomnochange}
          name="room"
          type="text"
        ></input>
        <Router>
          <Link to={`/${username}/${roomno}`}>
            <button onClick={submit}>Submit</button>
          </Link>
          <Switch>
            <Route path={`/${username}/${roomno}`}>
              <Chatroom socket={socket.current} username={username} roomno={roomno}></Chatroom>
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default Signup;
