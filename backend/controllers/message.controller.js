const Message = require("../models/message.model.js");
const User = require("../models/user.model.js");
const cloudinary = require("../libs/cloudinary.js");
const { getReceiverSocketId, io } = require("../libs/socket.js");

exports.getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error while getting users info" });
  }
};

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

    // ✅ Populate postId ก่อนส่งไป
    const populatedMessage = await newMessage.populate("postId");

    // Real-time messaging
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
  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  }).populate("postId");
  res.status(200).json(messages);
};