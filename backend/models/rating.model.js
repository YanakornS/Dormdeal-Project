const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RatingSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rater: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

RatingSchema.index({ post: 1, rater: 1 }, { unique: true });

module.exports = model("Rating", RatingSchema);