const express = require("express");
const router = express.Router();
const authJwt = require("../middlewares/auth.middleware.js");
const ChatRoomController = require("../controllers/chatroom.controller.js");

router.post("/", authJwt.verifyToken, ChatRoomController.createChatRoom);
router.get("/", authJwt.verifyToken, ChatRoomController.getChatRooms);
router.post("/read/:receiverId", authJwt.verifyToken, ChatRoomController.markAsRead);

module.exports = router;