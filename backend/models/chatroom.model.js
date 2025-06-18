const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ChatRoomSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      }, 
    ],
    unreadCount: {
      type: Map,
      of: Number, // userId จำนวนข้อความที่ยังไม่ได้อ่าน
      default: {},
    },
  },
  { timestamps: true }
);

const ChatRoomModel = model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoomModel;
