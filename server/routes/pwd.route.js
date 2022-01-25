const express = require('express');
const rateLimiter = require('../middleware/ratelimiter.middleware');

const forgotPasswordRateLimit = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 1,
  message: 'Too many requests, please try again later for resetting password.',
});

const {
  forgotPwdController,
  resetPasswordController,
} = require('../controllers/pwd.controllers');

const router = express.Router();

router.post('/_reset_password/:JWT_TOKEN', resetPasswordController);
router.post('/_forgot_password', forgotPasswordRateLimit, forgotPwdController);

module.exports = router;
