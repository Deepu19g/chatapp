import "./App.css";
import { io } from "socket.io-client";
import Signup from "./Signup";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
//import Chatroom from "./Chatroom";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Signup></Signup>
          </Route>
         
        </Switch>
      </Router>
    </div>
  );
}

export default App;
