const express = 'express';
// TODO: Add middleware Route here


const {createRoomById} = require('../controllers/room.controllers')
const router = express.Router();




router.route('/').post(createRoomById);
// router.route('/:id').get();