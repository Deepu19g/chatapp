const mongoose = require("mongoose");
const { Schema } = mongoose;
const chatSchema = new Schema(
  {
    userName: String,
    msgs: String,
    txt:Object,
    sender: String,
    
    time: String,
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = {Chat,chatSchema};
