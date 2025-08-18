const Message = require("../models/message.model.js");
const ChatRoom = require("../models/chatroom.model.js");
const cloudinary = require("../libs/cloudinary.js");
const { getReceiverSocketId, io } = require("../libs/socket.js");

exports.sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver Id is required" });
    }

    const senderId = req.userId;
    const { text, image, postId } = req.body;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      postId,
    });

    await newMessage.save();

    const populatedMessage = await newMessage.populate("postId");

    const chatroom = await ChatRoom.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // เพิ่ม unreadCount ให้ receiver
    if (chatroom) {
      const current = chatroom.unreadCount.get(receiverId) || 0;
      chatroom.unreadCount.set(receiverId, current + 1);
      await chatroom.save();
    }

    // ส่ง real-time ไปยัง receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }

    res.status(200).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error while sending message" });
  }
};

exports.getMessages = async (req, res) => {
  const { id: userToChatId } = req.params;
  const myId = req.userId;

  //หาข้อความ
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  }).populate("postId");

  res.status(200).json(messages);
};

