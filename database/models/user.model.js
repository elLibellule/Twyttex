const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema;

const userSchema = schema({
  username: { type: String },
  local: {
    email: { type: String, require: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    emailToken: { type: String },
    password: { type: String },
    passwordToken: { type: String },
    passwordTokenExpiration: { type: Date },
    googleId: { type: String },
  },
  avatar: { type: String, default: "/images/default-profile.svg" },
  following: { type: [schema.Types.ObjectId], ref: "user" },
});

userSchema.statics.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (err) {
    throw err;
  }
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password);
};

const User = mongoose.model("user", userSchema);
module.exports = User;
