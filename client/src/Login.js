import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lpic from "../src/assets/Landingpic.png";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import SnackBar from "./Components/SnackBar";

function Login() {
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [warn, setwarn] = useState("");
  const [auth, setauth]  = useState(true);
  const [snackopen, setsnackOpen] = useState(false);
  const [snacktxt,setsnacktxt] = useState()
  const navigate = useNavigate();

  const handlesnack = () => {
    setsnackOpen(true);
  };

  let logging = async (e) => {
    console.log("logged");
    e.preventDefault();
    try {
      let status = await axios
        .post("http://localhost:5000/user/login", {
          password: password,
          email: email,
        })
        .then((result) => result.data);

      if (status == "success") {
        localStorage.setItem(`loggedin${email}`, true);
        navigate(`/ChatLanding/${email}`);
      } else {
      
       setsnacktxt(status)
        handlesnack();
      }
    } catch (err) {
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
        <Grid container className="card card-3 Login-centarlcard" md={9} sm={9} lg={10}>
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
            // className="Signup-card-body"
            style={{
              background: "white",
              display: "flex",
              flexDirection: "column",
              //justifyContent: "center",
            }}
            xs={12}
            sm={6}
          >
            <h2 className="title" style={{ color: "black" }}>
              Registration Info
            </h2>
            <ValidatorForm
              method="POST"
              onSubmit={logging}
              className="Login-form"
            >
              <Box className="input-group">
                <TextValidator
                  className="input--style-3 NewLanding-input"
                  placeholder="Email"
                  name="email"
                  value={email}
                  validators={["required", "isEmail"]}
                  errorMessages={["this field is required", "email is invalid"]}
                  onChange={(e) => setemail(e.target.value)}
                />
              </Box>

              <Box className="input-group">
                <TextValidator
                  type="password"
                  placeholder="Password"
                  value={password}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                  className="input--style-3 NewLanding-input"
                  onChange={(e) => setpassword(e.target.value)}
                />
              </Box>

              <div className="p-t-10">
                <Button type="submit" className="btn btn--pill btn--green">
                  Login
                </Button>
              </div>
            </ValidatorForm>
            {/*{warn ? <p>{warn}</p> : ""}*/}
            <SnackBar snackopen={snackopen} setsnackOpen={setsnackOpen} snacktxt={snacktxt}></SnackBar>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;
