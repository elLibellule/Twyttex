const Tweet = require("../database/models/tweet.model");
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

exports.getUserByUsername = (username) => {
  return User.findOne({ username });
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[]\]/g, "$&");
}

exports.searchUsersByUsername = (search) => {
  const regEx = `^${escapeRegExp(search)}`;
  const reg = new RegExp(regEx);
  return User.find({ username: { $regex: reg } });
};

exports.addUserIdToCurrentUserFollowing = (currentUser, userId) => {
  return User.updateOne({_id: currentUser._id}, { $push: { following: userId } });
}

exports.removeUserIdToCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = currentUser.following.filter( objId => objId.toString() !== userId );
  return currentUser.save();
}

