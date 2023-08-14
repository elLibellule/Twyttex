const User = require("../database/models/user.model");

exports.createUser = async (user, methodUsed) => {
  try {
    if (methodUsed === "local") {
      const hashedPassword = await User.hashPassword(user.password);
      const newUser = new User({
        username: user.username,
        local: {
          email: user.email,
          password: hashedPassword,
        },
      });
      return newUser.save();
    } else if (methodUsed === "google") {
      const newUser = new User({
        username: user.displayName,
        local: {
          googleId: user.id,
          email: user.emails[0].value,
        },
      });
      return newUser.save();
    }
  } catch (err) {
    throw err;
  }
};

exports.findUserById = async (id) => {
  return User.findById(id);
};

exports.findUserByEmail = async (email) => {
  return User.findOne({ "local.email": email });
};

exports.findUserByGoogleId = (googleId) => {
  return User.findOne({ "local.googleId": googleId });
};
