const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

exports.sign = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required to sign in" });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {  
    return res.status(404).json({ message: "Email is not found" });
  }

  const token = jwt.sign({ id: user._id, email: user.email, role: user.role, displayName: user.displayName, photoURL: user.photoURL }, secret, {
    expiresIn: "1h",
  });

  const userInfo = {
    token: token,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
  res.status(200).json(userInfo);
  console.log(userInfo);
  
};

exports.addUser = async (req, res) => {
  try {
    const { email, displayName, photoURL } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email and displayName are required" });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือไม่
    const existedUser = await UserModel.findOne({ email });
    if (existedUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    // สร้างผู้ใช้ใหม่
    const newUser = new UserModel({ displayName, email, photoURL });
    await newUser.save();

    //res.status(201).json({ message: "User added successfully" });
    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).json({
      message: "Something error occurred while adding a new user",
      error: error.message,
    });
  }
};

