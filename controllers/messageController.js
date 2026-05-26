const { ResultWithContextImpl } = require("express-validator/lib/chain");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/messageQueries");

const validateMessage = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .bail()
    .isLength({ max: 255 })
    .withMessage(`Title must not be longer than 255 characters.`),
  body("message").trim().notEmpty().withMessage("Message is required."),
];

const getNewMessage = (req, res) => {
  res.render("messages/new", { title: "New message" });
};

const getAllMessages = () => {
  const messages = db.getAllMessages();
  return messages;
};

const deleteMessage = (req, res) => {
  db.deleteMessage(req.body.messageId);
  res.redirect("/");
};

const postNewMessage = [
  validateMessage,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("messages/new", {
        title: "New message",
        errors: errors.array(),
      });
    }
    const { title, message } = matchedData(req);
    const userId = req.user.user_id;
    await db.createMessage({ title, message, userId });
    res.redirect("/");
  },
];

module.exports = {
  getNewMessage,
  postNewMessage,
  getAllMessages,
  deleteMessage,
};
