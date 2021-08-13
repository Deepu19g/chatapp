import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
function Login() {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [warn, setwarn] = useState(false);
  const [auth,setauth] = useState(true)
  const history = useHistory();
  let logging = async (e) => {
    e.preventDefault();
    try {
      let arr = await axios
        .post("http://localhost:5000/login", {
          password: password,
          email: email,
        })
        .then((result) => result.data);
      console.log("state modified");
     
     if ( arr[0] && arr[0].password === password) {
        
       
        history.push(`/ChatLanding/${auth}/${email}`);
      } else {
        setwarn(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={logging} method="POST">
        <label>
          Email
          <input
            type="email"
            name="name"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="nam"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
        </label>

        <button type="submit">Login</button>
      </form>
      {warn ? <p>Incorrect email or password</p> : ""}
    </div>
  );
}

export default Login;
