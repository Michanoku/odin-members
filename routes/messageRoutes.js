const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../passport/authMiddleware");

router.get("/new", authMiddleware.isAuth, messageController.getNewMessage);
router.post("/new", authMiddleware.isAuth, messageController.postNewMessage);
router.post("/delete", authMiddleware.isAdmin, messageController.deleteMessage);

module.exports = router;
