const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/auth.middleware.js");
const MessageController = require("../controllers/message.controller.js");

router.get("/:id", authJwt.verifyToken, MessageController.getMessages);
router.post("/send/:id", authJwt.verifyToken, MessageController.sendMessage);

module.exports = router;