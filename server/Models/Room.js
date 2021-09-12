const mongoose = require("mongoose");
  const { Schema } = mongoose;
  const roomSchema = new Schema({
    time:String,
    roomno:String,
    
    members:[String],
    
  },{timestamps:true});

  module.exports = mongoose.model('Room', roomSchema);