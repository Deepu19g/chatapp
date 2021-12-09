import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lpic from "../src/assets/Landingpic.png";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
function Login() {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [warn, setwarn] = useState("");
  const [auth, setauth] = useState(true);

  const navigate = useNavigate();
  let logging = async (e) => {
    console.log("logged");
    e.preventDefault();
    try {
      let status = await axios
        .post("http://localhost:5000/login", {
          password: password,
          email: email,
        })
        .then((result) => result.data);

      if (status == "success") {
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
    <Box
      sx={{ flexGrow: 1 }}
      className="page-wrapper bg-gra-01 p-t-180 p-b-100 font-poppins"
      style={{display:"flex",flexDirection:"column",justifyContent:"center"}}
    >
      <Box className="wrapper wrapper--w780" style={{display:"flex", justifyContent:"center"}}>
        <Grid container className="card card-3"  md={9} sm={9} lg={10}>
          <Grid item className="card-heading" xs={12} sm={6}>
            <img
              className="Login-leftimg"
              //style={{ height: "100%", width: "100%", objectFit: "cover" }}
              src={Lpic}

            />
          </Grid>
          <Grid
            item
            className="card-body"
            style={{
              background: "white",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            xs={12}
            sm={6}
          >
            <h2 className="title" style={{ color: "black" }}>
              Registration Info
            </h2>
            <form method="POST" onSubmit={logging} className="Login-form">
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
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;
