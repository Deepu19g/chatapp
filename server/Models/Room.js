const mongoose = require("mongoose");
const { Schema } = mongoose;
const {chatSchema}=require("./Chat")
const roomSchema = new Schema(
  {
    time: String,
    roomno: String,
    admin: [String],
    members: [String],
    invitecode: String,
    roompic: String,
    chat:[chatSchema]
  },
  { timestamps: true }
);


module.exports = mongoose.model("Room", roomSchema);
