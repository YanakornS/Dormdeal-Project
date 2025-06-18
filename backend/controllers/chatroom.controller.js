const ChatRoom = require("../models/chatroom.model");
const { getReceiverSocketId, io } = require("../libs/socket.js");

exports.createChatRoom = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    if (!receiverId || !senderId ) {
      return res.status(400).json({ message: "SenderId and ReceiverId is required" });
    }

    // หาแชท
    let chatroom = await ChatRoom.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // สร้างใหม่
    if (!chatroom) {
      chatroom = await ChatRoom.create({
        participants: [senderId, receiverId],
      });

      // ส่ง Socket ไปหา Receiver
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newChat");
      }
    }

    //ดึงข้อมูล + เทียบ ID
    await chatroom.populate("participants");
    const sender = chatroom.participants.find(
      (p) => p._id.toString() === senderId
    );
    const receiver = chatroom.participants.find(
      (p) => p._id.toString() === receiverId
    );
    

    res.status(200).json({ sender, receiver });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error while creating chatroom" });
  }
};

exports.getChatRooms = async (req, res) => {
  try {
    const userId = req.userId;

    // userId เราไปเทียบ
    const chatrooms = await ChatRoom.find({
      participants: userId,
    }).populate("participants");

    // เฉพาะ partner 
    const result = chatrooms.map((room) => {
      const partner = room.participants.find(
        (p) => p._id.toString() !== userId
      );

      // user แต่ละคนที่ไม่ได้อ่าน
      const unread = room.unreadCount.get(userId) || 0;

      return {
        partner,
        unread,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error while getting chatroom" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { receiverId } = req.params;

    const chatroom = await ChatRoom.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    // Set unreadCount = 0 นะจ๊ะ
    chatroom.unreadCount.set(userId, 0);
    
    await chatroom.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

