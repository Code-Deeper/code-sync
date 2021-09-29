const express = require("express");
// TODO: Add middleware Route here

const router = express.Router();
const {
    LoginUser,
    registerUser
} = require("../controllers/user.controllers");

router.route("/register").post(registerUser);
router.route("/login").post(LoginUser);



module.exports = router;

