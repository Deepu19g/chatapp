import axios from "axios";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
function Login() {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [warn, setwarn] = useState("");
  const [auth,setauth] = useState(true)
  
  const history = useHistory();
  let logging = async (e) => {
    
    e.preventDefault();
    try {
      let status = await axios
        .post("http://localhost:5000/login", {
          password: password,
          email: email,
        })
        .then((result) => result.data);
     
     
     if ( status=="success") {
        
      localStorage.setItem(`loggedin${email}`, true);
        history.push(`/ChatLanding/${email}`);
      } else {
        setwarn(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {/*<form onSubmit={logging} method="POST">
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
  {warn!=="" ? <p>{warn}</p> : ""}*/}
  	
	
	
  </div>
  );
}

export default Login;
