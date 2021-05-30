import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Signup from "./Signup";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
//import Chatroom from "./Chatroom";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Signup />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
