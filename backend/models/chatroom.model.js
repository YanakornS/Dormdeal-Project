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
  },
  { timestamps: true }
);

const ChatRoomModel = model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoomModel;
