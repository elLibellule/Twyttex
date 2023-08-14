const Tweet = require("../database/models/tweet.model");

exports.getTweet = (tweetId) => {
  return Tweet.findOne({ _id: tweetId });
};

exports.getTweets = () => {
  return Tweet.find({});
};

exports.createTweet = (tweet) => {
  const newTweet = new Tweet(tweet);
  return newTweet.save();
};

exports.deleteTweet = (tweetId) => {
  return Tweet.findByIdAndDelete(tweetId);
};

exports.updateTweet = (tweetId, tweet) => {
  return Tweet.findByIdAndUpdate(
    tweetId,
    { $set: tweet },
    { runValidators: true }
  );
};
