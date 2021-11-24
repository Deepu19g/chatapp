import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lpic from "../src/assets/Landingpic.png";
function Login() {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [warn, setwarn] = useState("");
  const [auth,setauth] = useState(true)
  
  const navigate = useNavigate();
  let logging = async (e) => {
    console.log("logged")
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
        navigate(`/ChatLanding/${email}`);
      } else {
        setwarn(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page-wrapper bg-gra-01 p-t-180 p-b-100 font-poppins">
      <div className="wrapper wrapper--w780">
        <div className="card card-3">
          <div className="card-heading">
            <img
              style={{ height: "100%", width: "100%", objectFit: "contain" }}
              src={Lpic}
            />
          </div>
          <div className="card-body" style={{ background: "white" }}>
            <h2 className="title" style={{ color: "black" }}>
              Registration Info
            </h2>
            <form method="POST" onSubmit={logging}>
            <div className="input-group">
                <input
                  className="input--style-3 NewLanding-input"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  className="input--style-3 NewLanding-input"
                  onChange={(e) => setpassword(e.target.value)}
                ></input>
              </div>

             

              <div className="p-t-10">
               
                  <button type="submit" className="btn btn--pill btn--green">
                    Login
                  </button>
              
              </div>
            </form>
            {warn ? <p>{warn}</p> : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
