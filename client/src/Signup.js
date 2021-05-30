import { React, useState, useEffect } from "react";
import { Route, Switch,BrowserRouter as Router } from "react-router-dom";
import Chatroom from "./Chatroom";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import querystring from "query-string"

function Signup() {
  const [username, setusername] = useState("");
  const [roomno, setroomno] = useState();
  var socket;
  console.log(username)
  socket = io("http://localhost:5000");

  let submit = (e) => {
    
    console.log("reaached");
  
    socket.emit("join", { no: roomno,user:username }); //if such a username already exists deal with it later
  };
  let handlenamechange = (e) => {
    setusername(e.target.value);
  };
  let roomnochange = (e) => {
    setroomno(e.target.value);
  };

  return (
    <div>
      <div >
        <input
          type="text"
          value={username}
          onChange={handlenamechange}
          name="user"
        ></input>
        <input value={roomno} onChange={roomnochange} name="room" type="text"></input>
        <Router>
          <Link to={`/${username}/${roomno}`}><button type="submit" onClick={submit}>Submit</button></Link>
         <Switch>
          <Route path={`/${username}/${roomno}`}>
            <Chatroom></Chatroom>
          </Route>
          </Switch>
          </Router>
      </div>
      
    </div>
  );
}

export default Signup;
