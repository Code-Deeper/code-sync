const asyncHandler = require('express-async-handler');
const User = require('../models/user.modal');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports.forgotPwdController = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).send({ status: 'user not found' });
    throw new Error('User not found');
  }

  const token = await user.createPWDresetToken();
  const resetURL = `${process.env.FRONTEND_URL}/_reset_password/${token}`;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.OUR_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
    from: 'codesync.live',
  });

  var mailOptions = {
    from: process.env.OUR_EMAIL,
    to: user.email,
    cc: 'codedeeper.work@gmail.com',
    subject: 'Codedeeper password reset Token',
    html: `<p>Hello , ${user.name} here is your token link. <a href="${resetURL}">Click Here</a> to reset the password</p>`,
    text: `<p>Hello , ${user.name} here is your token link. <a href="${resetURL}">Click Here</a> to reset the password</p>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(200).send({
        status: 'failed',
      });
    } else {
      console.log('Email sent: ' + info.response);
      if (process.env.NODE_ENV == 'development') {
        res.status(200).send({
          status: 'success',
          resetURL,
        });
      } else {
        res.status(200).send({status:"mail sent successfully"});
      }
    }
  });
});

module.exports.resetPasswordController = asyncHandler(async (req, res) => {
  const reset_token = req.params.JWT_TOKEN;
  try {
    const payload = jwt.verify(reset_token, process.env.JWT_SECRET_KEY);
    const { password, confirmpassword } = req.body;
    if (!password || !confirmpassword)
      throw new Error('Password should be provided!');

    if (password !== confirmpassword) throw new Error("Password doesn't match");

    const user = await User.findById(payload.id);
    if (!user) throw new Error('No user exists with this id');

    if (user.passwordChangedAt && user.passwordChangedAt > payload.iat * 1000)
      throw new Error(
        'Please raise a new Reset Request,this token was used earlier'
      );

    const newPassword = await bcrypt.hash(password, 12);
    user.set({ password: newPassword, passwordChangedAt: new Date() });
    await user.save();

    return res.status(200).send({
      status: 'password changed successfully',
    });
  } catch (err) {
    res.status(400).send({
      err: err.message,
    });
  }
});
