const getAllMessages = require("./messageController").getAllMessages;

const index = async (req, res) => {
  const messages = await getAllMessages();
  res.render("index", { title: "Entrance", messages: messages });
};

const testError = (req, res, next) => {
  next(new Error("Intentional test error"));
};

module.exports = {
  index,
  testError,
};
