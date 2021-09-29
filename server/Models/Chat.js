const mongoose = require("mongoose");
  const { Schema } = mongoose;
  const chatSchema = new Schema({
    msgs:String,
    roomno:String,
    sender:String,
    invitecode:String,
    members:[String],
    time:String,
  },{timestamps:true});

  const Chat = mongoose.model('Chat', chatSchema);
  module.exports=Chat