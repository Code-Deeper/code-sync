const mongoose = require("mongoose");

const Room = mongoose.model("Room", {
  room_id: {
    type: String,
    required: true,
  },
  room_title: {
    type: String,
    required: true,
  },
  room_body: {
    type: String,
  },
  room_language : {
    type : String
  },
  room_input : {
    type : String
  }
});

module.exports = Room;
