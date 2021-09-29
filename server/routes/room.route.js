const express = require("express");
// TODO: Add middleware Route here

const {
  createRoomById,
  getRoomByID,
  updateRoomById
} = require("../controllers/room.controllers");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
// router.route("/").post(createRoomById);
// router.route("/:id").get(getRoomByID).patch(updateRoomById);
router.post('/', authMiddleware, createRoomById);
router.get('/:id', authMiddleware, getRoomByID);
router.patch('/:id', authMiddleware, updateRoomById);

module.exports = router;
// router.route('/:id').get();
