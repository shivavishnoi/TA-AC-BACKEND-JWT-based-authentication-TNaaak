var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var userSchema = new Schema(
  {
    email: { type: String, required: true, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified && this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    }
    next();
  } catch (error) {
    return error;
  }
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

userSchema.methods.signToken = async function () {
  var payload = { email: this.email, userId: this.id };
  try {
    var token = await jwt.sign(payload, process.env.TOKEN_SECRET);
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    email: this.email,
    userId: this.id,
    token: token,
  };
};
module.exports = mongoose.model('User', userSchema);
