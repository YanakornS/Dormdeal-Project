const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

//Register
exports.createMod = async (req, res) => {
  const { email, password,displayName } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: "กรุณาระบุข้อมูลให้ครบถ้วน",
    });
  }

  try {
    // ตรวจสอบว่า email ซ้ำหรือไม่
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        message: "อีเมลนี้ถูกใช้งานแล้ว",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, salt);
    await UserModel.create({
    email,
    password: hashedPassword,
    role: "mod",
    displayName,
});

    res.send({
      message: "สร้างผู้ดูแลระบบเรียบร้อยแล้ว",
    });
  } catch (error) {
    res.status(500).send({
      message:
        error.message ||
        "เกิดข้อผิดพลาดระหว่างการสร้างผู้ดูแลระบบ",
    });
  }
};


exports.updateUserStatus = async (req, res) => {
  const { userId, newStatus } = req.body;

  // ตรวจสอบค่า newStatus ว่าถูกต้องหรือไม่
  const validStatuses = ["normal", "Banned", "outof"];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ message: "ค่าของสถานะไม่ถูกต้อง" });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้ที่ระบุ" });
    }

    user.userStatus = newStatus;
    await user.save();

    res.status(200).json({
      message: `เปลี่ยนสถานะผู้ใช้งานเป็น ${newStatus}`,
    
    });
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดระหว่างการอัปเดตสถานะผู้ใช้งาน",
      error: error.message,
    });
  }
};
