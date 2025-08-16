const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.sign = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "กรุณาระบุอีเมล" });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "ไม่พบอีเมลนี้" });
  }

  // ถ้าผู้ใช้มีรหัสผ่าน
  if (user.password) {
    if (!password) {
      return res.status(400).json({ message: "กรุณาระบุรหัสผ่าน" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
  } else {
    // กรณีผู้ใช้ OAuth login ไม่มี password
    return res.status(400).json({ message: "บัญชีนี้ใช้ OAuth โปรดเข้าสู่ระบบด้วย Google" });
  }

  // สร้าง JWT
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      photoURL: user.photoURL,
    },
    secret,
    { expiresIn: "24h" }
  );

  const userInfo = {
    token,
    email: user.email,
    _id: user._id,
    role: user.role,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  res.status(200).json(userInfo);
};


exports.addUser = async (req, res) => {
  try {
    const { email, displayName, photoURL, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: "กรุณาระบุอีเมล" });
    }

    const existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      return res.status(200).json({ message: "มีผู้ใช้นี้อยู่ในระบบแล้ว" });
    }

    const newUser = new UserModel({ displayName, email, photoURL, role });
    await newUser.save();

    res.status(201);
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดขณะเพิ่มผู้ใช้ใหม่",
      error: error.message,
    });
  }
};


// ตัวอย่าง updatePhotoURL controller
exports.updatePhotoByEmail = async (req, res) => {
  const { email, photoURL } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!photoURL)
      return res.status(400).json({ message: "Photo URL is required" });
    // อัปเดต photoURL ของผู้ใช้
    user.photoURL = photoURL;
    await user.save();

    res.status(200).json({ message: "Photo updated successfully", photoURL });
  } catch (error) {
    console.error("Update photo error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const userId = req.userId; 
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "กรุณาระบุรหัสผ่านใหม่" });
    }

    // หา user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    // hash รหัสผ่านใหม่
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // บันทึกลง DB
    await user.save();

    return res.status(200).json({ message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
  } catch (error) {
    return res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};

