const UserModel = require("../models/user.model");
require("dotenv").config();
const secret = process.env.SECRET;
const jwt = require("jsonwebtoken");
const admin = require("../configs/firebase.admin.config");
const blockchainService = require("../libs/blockchain/service");
const { getOrGenerateBlockchainAddress } = require("../libs/blockchain/utils");

exports.sign = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: "idToken is required" });
  }

  try {
    // verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);

    // ดึง email จาก token ของ Firebase
    const email = decoded.email;
    const displayName = decoded.name;
    const photoURL = decoded.picture;

    // หาผู้ใช้ใน database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email is not found" });
    }

    // ออก JWT ของระบบ
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
      _id: user._id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    return res.status(200).json(userInfo);
  } catch (error) {
    console.error("Sign error:", error);
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { email, displayName, photoURL, role } = req.body;

    if (!email || !displayName) {
      return res.status(400).json({ message: "Email, displayName, photoURL are required" });
    }

    const existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    const newUser = new UserModel({ displayName, email, photoURL, role });
    await newUser.save();

    res.status(201).json({
      message: "Add user successfully",
      user: {
        email: newUser.email,
        displayName: newUser.displayName,
        photoURL: newUser.photoURL,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Add user error:", error);
    return res.status(401).json({ message: "Add user failed" });
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

// ดึง reputation ของผู้ใช้จาก blockchain
exports.getUserReputation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    // ดึงที่อยู่ blockchain (จะถูกบันทึกลง database ถ้ายังไม่มี)
    const blockchainAddress = await getOrGenerateBlockchainAddress(user);

    // ดึง reputation จาก blockchain
    let blockchainReputation = null;
    if (blockchainService.isEnabled()) {
      try {
        blockchainReputation = await blockchainService.getReputation(blockchainAddress);
      } catch (blockchainError) {
        console.error("Error getting reputation from blockchain:", blockchainError.message);
        // ถ้า blockchain ล้มเหลว ให้ใช้ค่า reputation เริ่มต้น
      }
    }

    // Return reputation data
    return res.json({
      success: true,
      data: {
        userId: user._id,
        displayName: user.displayName,
        blockchainAddress: blockchainAddress,
        reputation: blockchainReputation || {
          ratingSum: 0,
          ratingCount: 0,
          penaltySum: 0,
          averageRating: 0,
          reputation: 0,
        },
      },
    });
  } catch (error) {
    console.error("Error in getUserReputation:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล reputation",
      error: error.message,
    });
  }
};


