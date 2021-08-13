import { React, useState, useEffect, useRef } from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Chatroom from "./Chatroom";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import querystring from "query-string";
import { Col, Container, Row } from "react-bootstrap";
import "./ChatLanding.css";
function ChatLanding({ email }) {
  const [roomno, setroomno] = useState(0);
  const socket = useRef();
  const submit = (e) => {
    console.log("reached");
    socket.current.emit("join", { no: roomno, email: email }); //if such a username already exists deal with it later
  };

  const roomnochange = (e) => {
    setroomno(e.target.value);
  };

  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    
    return () => socket.current.close();
  }, []); //TODO: reinitialize socket on user change
  console.log(socket);
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

              <Link to={`/Login/${roomno}`}>
                <button onClick={submit}>Submit</button>
              </Link>
            </Col>
            <Col sm={9}>
              <Switch>
                <Route path={`/Login/${roomno}`}>
                  <Chatroom
                    socket={socket.current}
                    email={email}
                    roomno={roomno}
                  ></Chatroom>
                </Route>
              </Switch>
            </Col>
          </Row>
        </Router>
      </Container>
    </div>
  );
}

export default ChatLanding;
