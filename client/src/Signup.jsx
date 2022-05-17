import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./assets/vendor/mdi-font/css/material-design-iconic-font.min.css";
import "./assets/vendor/font-awesome-4.7/css/font-awesome.min.css";
import "./assets/vendor/select2/select2.min.css";
import "./assets/vendor/datepicker/daterangepicker.css";
import "./assets/css/main.css";
import Lpic from "../src/assets/Landingpic.png";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

function Signup() {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [warn, setwarn] = useState(false);
  const [auth, setauth] = useState(true);
  const navigate = useNavigate();
  const handlenamechange = (e) => {
    setusername(e.target.value);
  };
  const [isDesktop, setDesktop] = useState(window.innerWidth > 576);

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  }, []);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 600);
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

      setwarn(false);
      localStorage.setItem(`jwt${email}`, `${res.data}`);
      localStorage.setItem(`${email}username`, `${username}`);
      console.log("fresh data");
      //getauth(true);
      navigate(`/ChatLanding/${email}`);

      //setstatus(true)
    } catch (err) {
      setwarn(true);
      console.log(err);
    }
  };
  return (
    <Box
      sx={{ flexGrow: 1 }}
      className="page-wrapper bg-gra-01 p-t-180 p-b-100 font-poppins"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        className="wrapper wrapper--w780"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Grid container className="card card-3" md={9} sm={9} lg={10}>
          <Grid item className="card-heading" xs={12} sm={6}>
            <img
              className="Login-leftimg"
              //style={{ height: "100%", width: "100%", objectFit: "cover" }}
              src={Lpic}
            />
          </Grid>

          <Grid
            item
            className={
              isDesktop && window.innerWidth > window.innerHeight
                ? "card-body"
                : "Signup-card-body"
            }
            style={{
              background: "white",
              display: "flex",
              flexDirection: "column",
            }}
            xs={12}
            sm={6}
          >
            <h2 className="title" style={{ color: "black" }}>
              Registration Info
            </h2>
            <ValidatorForm
              method="POST"
              onSubmit={signup}
              className="Login-form"
            >
              <Box className="input-group">
                <TextValidator
                  className="input--style-3 NewLanding-input "
                  type="text"
                  placeholder="Username"
                  name="name"
                  value={username}
                  validators={["required"]}
                  errorMessages={[
                    "this field is required",
                  
                  ]}
                  onChange={handlenamechange}
                />
              </Box>

              <Box className="input-group">
                <TextValidator
                  type="password"
                  placeholder="Password"
                  value={password}
                  className="input--style-3 NewLanding-input"
                  validators={["required"]}
                  errorMessages={[
                    "this field is required",
                  
                  ]}
                  onChange={(e) => setpassword(e.target.value)}
                />
              </Box>
              <Box className="input-group">
                <TextValidator
                  className="input--style-3 NewLanding-input "
                  type="email"
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="Email"
                  name="email"
                  value={email}
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    "this field is required",
                    "email is not valid",
                  ]}
                />
              </Box>

              <div className="p-t-10">
                <Button type="submit" className="btn btn--pill btn--green" variant="contained" style={{backgroundColor:"green"}}>
                  Signup
                </Button>
              </div>
            </ValidatorForm>
            {warn ? <p>{warn}</p> : ""}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Signup;
