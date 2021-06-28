const express = require("express");
// TODO: Add middleware Route here

const {
  createRoomById,
  getRoomByID,
  updateRoomById
} = require("../controllers/room.controllers");
const router = express.Router();

router.route("/").post(createRoomById);
router.route("/:id").get(getRoomByID).patch(updateRoomById);

module.exports = router;
// router.route('/:id').get();
