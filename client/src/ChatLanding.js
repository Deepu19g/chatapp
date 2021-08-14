import { React, useState, useEffect, useRef } from "react";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  useHistory,
} from "react-router-dom";
import Chatroom from "./Chatroom";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import querystring from "query-string";
import axios from "axios";
import { Col, Container, Row } from "react-bootstrap";
import "./ChatLanding.css";
function ChatLanding({ email }) {
  const [roomno, setroomno] = useState("");

  const [val, setval] = useState([]);
  const [recent, setrecent] = useState("");
  const socket = useRef();
  const history = useHistory();

  let submit = async () => {
    console.log("reached");
    setrecent(roomno)
    const res = await axios.post("http://localhost:5000/roomdata", {
      member: email,
      created_time:new Date().getTime(),
      roomno: roomno,
    });
    socket.current.emit("join", { no: roomno, email: email }); //if such a username already exists deal with it later
  };

  const roomnochange = (e) => {
    setroomno(e.target.value);
  };

  useEffect(() => {
    console.log("reached useEffect");
    let initialfetch = async () => {
      const res = await axios.post("http://localhost:5000/recents", {
        email: email,
      });
      return res;
    };
    initialfetch().then((rev) => setval(rev.data));
  }, []);
  useEffect(() => {
    socket.current = io("ws://localhost:5000");

    return () => socket.current.close();
  }, []); //TODO: reinitialize socket on user change

  console.log(recent);
  let clickrecents = (e) => {
    setrecent(e.target.innerHTML);
    socket.current.emit("join", { no: e.target.innerHTML, email: email });
    //history.push(`/Chatroom`);
  };
  return (
    <div>
      <Container fluid style={{ minHeight: "100vh" }}>
        <Router>
          <Row style={{ minHeight: "100vh" }}>
            <Col sm={3} id="leftend" style={{ overflowY: "scroll" }}>
              <p>Join Room</p>
              <p>Room no:</p>
              <input
                value={roomno}
                onChange={roomnochange}
                name="room"
                type="text"
              ></input>
              <button onClick={submit}>Submit</button>
              {/* <Link to={`/Chatroom`}>
             
  </Link>*/}
              {val.map((itm) => (
                <div
                  key={itm._id}
                  style={{ backgroundColor: "orange", margin: 5 }}
                  onClick={clickrecents}
                >
                  {itm.roomno}
                </div>
              ))}
            </Col>
            <Col sm={9}>
              {recent !== ""  && (
                <Chatroom
                  socket={socket.current}
                  email={email}
                  recent={recent}
                ></Chatroom>
              )}
              {/*<Switch>
                <Route path={`/Chatroom`}>
                 
                </Route>
              </Switch>*/}
            </Col>
          </Row>
        </Router>
      </Container>
    </div>
  );
}

export default ChatLanding;
