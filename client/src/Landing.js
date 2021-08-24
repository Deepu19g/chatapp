import axios from "axios";
import React, { useState } from "react";
import {
  Link,
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import ChatLanding from "./ChatLanding";
//username already taken scenario check
function Landing() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState();
  const [warn, setwarn] = useState(false);
  const [auth,setauth] = useState(true)
  const history = useHistory();
  const handlenamechange = (e) => {
    setusername(e.target.value);
  };
  let signup = async (e) => {
    e.preventDefault();
    console.log("working");
    try {
      

    
        const res = await axios.post("http://localhost:5000/signup", {
          username: username,
          password: password,
          email: email,
        });
        console.log("fresh data");
        //getauth(true);
        history.push(`/ChatLanding/${auth}/${email}`);
      
      //setstatus(true)
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <form method="POST" onSubmit={signup}>
        <label>
          Username:
          <input
            type="text"
            name="name"
            value={username}
            onChange={handlenamechange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="nam"
            onChange={(e) => setpassword(e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="nam"
            onChange={(e) => setemail(e.target.value)}
          />
        </label>

        <button type="submit">Signup</button>

        <Link to="/Login">
          <button type="submit">Login</button>
        </Link>
      </form>
      {warn ? <p>Email already exists</p> : ""}
    </div>
  );
}

export default Landing;
