import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../src/Signup";

import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

import Mobilechat from "./Components/Mobilechat";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/chats" element={<Mobilechat />}></Route>
          <Route
            path="/ChatLanding/:email"
            //component={PrivateRoute}
            element={<PrivateRoute />}
          ></Route>
          <Route exact path="/Login" element={<Login />}></Route>

          {/* <Route path="*" ><Redirect to="/Login"></Redirect></Route>*/}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
