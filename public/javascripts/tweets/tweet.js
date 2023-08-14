window.addEventListener("DOMContentLoaded", () => {
  deleteTweet();
  editTweet();
});

const deleteTweet = () => {
  const elements = document.querySelectorAll(".btn-danger");
  const tweetContainer = document.querySelector("#tweet-list-container");
  elements.forEach((element) => {
    element.addEventListener("click", async (event) => {
      const tweetId = event.target.getAttribute("tweetid");
      try {
        const response = await axios.delete(`/tweets/${tweetId}`);
        tweetContainer.innerHTML = response.data;
        deleteTweet();
      } catch (err) {
        console.log(err);
      }
    });
  });
};

const editTweet = () => {
  const elements = document.querySelectorAll(".btn-secondary");
  const tweetContainer = document.querySelector("#tweet-list-container");
  elements.forEach((element) => {
    element.addEventListener("click", (event) => {
      const tweetId = event.target.getAttribute("tweetid");
      window.location.href = `/tweets/edit/${tweetId}`;
      editTweet();
    });
  });
};
