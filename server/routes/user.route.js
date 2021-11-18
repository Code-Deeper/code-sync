const express = require("express");
// TODO: Add middleware Route here

const router = express.Router();
const {
    LoginUser,
    registerUser,
    googleAuthUser
} = require("../controllers/user.controllers");

router.route("/register").post(registerUser);
router.route("/login").post(LoginUser);
router.route("/gauth").post(googleAuthUser);




module.exports = router;

