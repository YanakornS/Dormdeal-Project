const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  displayName: { type: String, require: true, unique: true,},
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "mod", "user"], default: "user" },
  photoURL: { type: String}
}, {
  timestamps: true
});

const UserModel = model("User", UserSchema);
module.exports = UserModel;
