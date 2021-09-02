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
import { Col, Container, Row } from "react-bootstrap";
import "./ChatLanding.css";
function ChatLanding({ email }) {
  const [roomno, setroomno] = useState("");
  const { url } = useRouteMatch();
  const [val, setval] = useState([]);
  const [recent, setrecent] = useState("");
  const [sortarr, setsortarr] = useState([]);
  const [refresh, setrefresh] = useState("");
  const socket = useRef();
  const history = useHistory();

  let submit = async () => {
    console.log("recent backdoor");
    setrecent(roomno);
    const res = await axios.post("http://localhost:5000/roomdata", {
      member: email,
      time: new Date().getTime(),
      roomno: roomno,
    });
    initialfetch();
    socket.current.emit("join", { no: roomno, email: email });
    setroomno(" "); //if such a username already exists deal with it later
  };

  const roomnochange = (e) => {
    setroomno(e.target.value);
  };

  useEffect(() => {
    //func to find rooms associated wuth a user

    initialfetch();
  }, []);
  useEffect(() => {
    socket.current = io("ws://localhost:5000");
    socket.current.on("text", (data) => {
      initialfetch();
    });

    socket.current.emit("join", {});
    return () => socket.current.close();
  }, []); //TODO: reinitialize socket on user change

  let initialfetch = async () => {
    let jwtoken = localStorage.getItem(`jwt${email}`);
    let config = {
      headers: {
        Authorization: "Bearer" + " " + jwtoken,
      },
    };
    try{
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
    setval(res.reverse());
    }catch(err){
      history.goBack()
    }
    
    
  };

  let clickrecents = (e) => {
    console.log("recent changed");
    setrecent(e.target.innerHTML);
    //socket.current.emit("join", { no: e.target.innerHTML, email: email });
    // history.push(`${url}/${e.target.innerHTML}`);
    //history.push(`/${url}/${e.target.innerHTML}`);
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
              {val.map((itm) => {
                return (
                  <div
                    key={itm._id}
                    style={{ backgroundColor: "orange", margin: 5 }}
                    onClick={(e) => setrecent(e.target.innerHTML)}
                  >
                    {itm.roomno}
                  </div>
                );
              })}
            </Col>
            <Col sm={9}>
              {recent !== "" &&
                (console.log(recent),
                (
                  <Chatroom
                    //member={member}
                    socket={socket.current}
                    email={email}
                    recent2={recent}
                  ></Chatroom>
                ))}
              {/*<Switch>
                <Route path={`/${url}/${recent}`}>
                  <Chatroom
                    ={socksocketet.current}
                    email={email}
                    recent={recent}
                  ></Chatroom>
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
