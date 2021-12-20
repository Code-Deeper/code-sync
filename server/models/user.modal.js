const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordChangedAt: Date,
  id: {
    type: String,
  },
  googleLogin: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
  },
});

userSchema.methods.createPWDresetToken = async function () {
  return jwt.sign(
    { email: this.email, id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: 600 }
  );
};

const User = mongoose.model('User', userSchema);
module.exports = User;
