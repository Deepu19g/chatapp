import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import {
  Link,
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Landing from "./Landing";
import ChatLanding from "./ChatLanding";
//import Chatroom from "./Chatroom";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
function App() {
  let username = "";
  let auth = false;

  console.log(auth);
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route
            //exact
            path="/ChatLanding/:email"
            component={PrivateRoute}
          ></Route>
          <Route exact path="/Login" component={Login}></Route>
         {/* <Route path="*" ><Redirect to="/Login"></Redirect></Route>*/}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
