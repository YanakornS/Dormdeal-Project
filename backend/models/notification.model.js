const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["post_sold", "purchase_success", "rating_received"], required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  seller: { type: Schema.Types.ObjectId, ref: "User" },
  requiresRating: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = model("Notification", NotificationSchema);