const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

router.get("/new", messageController.getNewMessage);
router.post("/new", messageController.postNewMessage);
router.get("/delete", messageController.deleteMessage);

module.exports = router;
