const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const UserSchema = new Schema({
  displayName: { type: String, required: true, unique: true,},
  email: { type: String, required: true, unique: true },
  password: { type: String, },
  role: { type: String, enum: ["admin", "mod", "user"], default: "user" },
  userStatus: { type: String, enum: ["normal", "Banned", "outof"], default: "normal" },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  photoURL: { type: String},
  rating: {
    score: { type: Number, default: 0 },           
    count: { type: Number, default: 0 },          
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  buyers: [{ type: Schema.Types.ObjectId, ref: "User" }] 
},  {
  timestamps: true
});


const UserModel = model("User", UserSchema);
module.exports = UserModel;
