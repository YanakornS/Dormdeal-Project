const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  postType: {
    type: String,
    enum: ["WTB", "WTS"],
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "MainCategory",  
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ["มือสองสภาพดี", "มือสองสภาพพอใช้"],
    required: true,
  },
  postPaymentType: {
    type: String,
    enum: ["Free", "Paid"],
    default: "Free",
  },
  status: {
    type: String,
    enum: ["pending_review", "approved", "needs_revision", "rejected"],
    default: "pending_review",
  },
},{
  timestamps: true,
});

const PostModel = model("Post", PostSchema);
module.exports = PostModel;
