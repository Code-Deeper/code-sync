const asyncHandler = require("express-async-handler");
const Room = require("../models/room.model");

const getRoomByID = asyncHandler(async (req, res) => {

    const roomIID = req.params.id
    const room = await Room.find({room_id :roomIID })
    if(room){
        res.status(400).json(room);
    }else{
        res.status(400);
        throw new Error("Room Not Found!!");
    }
});

const createRoomById = asyncHandler(async (req, res) => {
  const { room_id, room_title, room_body } = req.body;
    // Edge Case room_id room_title null
    if(room_id == null || room_title ==null){
        res.status(400);
        throw new Error('Please Enter room id and name!');
        return;
    }

    const newRoom = new Room({
        room_id,
        room_title,
        room_body
    }) 
    const createRoom = await newRoom.save();
    res.status(201).json(createRoom);
});


module.exports = {createRoomById ,getRoomByID}