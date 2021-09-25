import React from "react";
import "./App.css";

import {
  
  BrowserRouter as Router,
  Switch,
  Route,
  
} from "react-router-dom";
import Landing from "./Landing";

import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

import Mobilechatroom from "./Mobilechatroom";
function App() {
  

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Landing}></Route>
          <Route exact path="/ChatLanding/:email/chats" component={Mobilechatroom}></Route>
          <Route

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
