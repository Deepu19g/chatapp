var express = require("express");
var router = express.Router();
const User = require("../Models/User");
const Room = require("../Models/Room");
const jwt = require("jsonwebtoken");
const app = express();
const http = require("http");

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

router.post("/userlist", (req, res) => {
  let getuserlist = async () => {
    let roomusers;
    await Room.find({ invitecode: req.body.invite })
      .exec()
      .then((qresult) => {
        roomusers = qresult[0]?.members;
      });
    console.log(roomusers);
    await User.find()
      .exec()
      .then((qresult) => {
        console.log(qresult.map((it) => it.email));
        //let result=qresult.map(itm=>itm.email)

        let remainingusers = qresult.filter((itm) => {
          if (roomusers?.includes(itm.email) == false) {
            return itm;
          }
        });
        // let userlist=remainingusers.map(itm=>itm.username)
        res.send({ userlist: remainingusers });
      });
  };
  getuserlist();
});

router.post("/login", (req, res) => {
  //login authentication
  let login = async ({ email, password }) => {
    let result = [];
    //console.log("reached login")
    result = await User.find({
      email: { $eq: email },
    });
    if (result[0] !== undefined) {
      if (result[0].password == password) {
        return "success";
      } else {
        return "incorrect username or password";
      }
    } else {
      return "user not registered";
    }
  };
  login(req.body, res).then((data) => {
    res.json(data);
  });
});

router.post("/signup", (req, res) => {
  //user signup
  let signup = async (data, res) => {
    try {
      /*let result=await client
    .db("sample_airbnb")
    .collection("ListingsAndReviews").findOne({email:{ $eq: data.email }})*/

      let result = await User.find({ email: { $eq: data.email } }).exec();

      if (result.length == 0) {
        const user = new User(data);
        await user.save();

        const accToken = jwt.sign(data, process.env.SECRETKEY);
        res.send(accToken);
      } else {
        res.status(403).json({ msg: "user already exists" });
      }
    } catch (err) {
      console.log(err);
    }
  };
  signup(req.body, res);
});

module.exports = router;
