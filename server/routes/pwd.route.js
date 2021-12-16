const express = require('express');
const {
  forgotPwdController,
  resetPasswordController,
} = require('../controllers/pwd.controllers');

const router = express.Router();

router.get('/_reset_password/:JWT_TOKEN', resetPasswordController);
router.post('/_forgot_password', forgotPwdController);

module.exports = router;
