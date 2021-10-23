const asyncHandler = require("express-async-handler");
const Room = require("../models/room.model");

const getRoomByID = asyncHandler(async (req, res) => {

  if (!req.userId) {
    return res.status(401).json({ status: 404, message: "UnAuthorized user!!" })
  }
  const roomIID = req.params.id;
  const room = await Room.findOne({ room_id: roomIID });
  if (room) {
    res.status(200).json(room);
  } else {
    res.status(400);
    throw new Error("Room Not Found!!");
  }
});

const createRoomById = asyncHandler(async (req, res) => {


  if (!req.userId) {
    return res.status(401).json({ status: 404, message: "UnAuthorized user!!" })
  }

  const { room_id, room_title, room_body, room_language, room_input } = req.body;
  // Edge Case room_id room_title null

  // if (room_id == null || room_title == null) {
  //   res.status(400);
  //   throw new Error("Please Enter room id and name!");
  //   return;
  // }

  const newRoom = new Room({
    room_id,
    room_title,
    room_body,
    room_language,
    room_input,
  });
  newRoom.save().then((createRoom) => {
    res.status(200).json(createRoom);
  }).catch((err) => {
    res.status(500).json(err);
  })

});

const updateRoomById = asyncHandler(async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ status: 404, message: "UnAuthorized user!!" })
  }
  const newRoomData = req.body;
  const rm_id = req.params.id;

  const updateRoomData = await Room.findOneAndUpdate(
    { room_id: rm_id },
    newRoomData
  );
  const returnData = await Room.findOne({ room_id: rm_id });
  if (!returnData) {
    res.status(400).send("Not Update User!");
    return;
  }
  res.status(200).json(returnData);
});
module.exports = { createRoomById, getRoomByID, updateRoomById };
