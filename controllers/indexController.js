const getAllMessages = require("./messageController").getAllMessages;

const index = (req, res) => {
    res.render("index", { title: "Entrance", messages: getAllMessages()});
};

const testError = (req, res, next) => {
  next(new Error('Intentional test error'));
};

module.exports = {
    index,
    testError,
}