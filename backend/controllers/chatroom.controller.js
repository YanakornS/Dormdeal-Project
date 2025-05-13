const ChatRoom = require("../models/chatroom.model");
const { getReceiverSocketId, io } = require("../libs/socket.js");

exports.createChatRoom = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: "Receiver Id is required" });
    }

    let chatroom = await ChatRoom.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chatroom) {
      chatroom = await ChatRoom.create({
        participants: [senderId, receiverId],
      });

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newChat");
      }
    }

    await chatroom.populate("participants", "-password");

    const partner = chatroom.participants.find(
      (p) => p._id.toString() !== senderId
    );

    res.status(200).json({ partner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getChatRooms = async (req, res) => {
    try {
      const userId = req.userId;
  
      const chatrooms = await ChatRoom.find({
        participants: userId,
      }).populate("participants");
  
      // กรองให้เหลือแค่ partner คนเดียว (ไม่เอาตัวเอง)
      const chatPartners = chatrooms.map((chat) => {
        const partner = chat.participants.find(
          (p) => p._id.toString() !== userId
        );
        return partner;
      });
  
      res.status(200).json(chatPartners);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
