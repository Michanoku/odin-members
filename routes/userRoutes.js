const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../passport/authMiddleware");

router.get("/register", userController.getRegister);
router.post("/register", userController.postRegister);
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);
router.get("/logout", userController.getLogout);
router.get("/join", authMiddleware.isAuth, userController.getJoin);
router.post("/join", authMiddleware.isAuth, userController.postJoin);

module.exports = router;
