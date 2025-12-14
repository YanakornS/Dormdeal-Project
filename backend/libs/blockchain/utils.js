const { ethers } = require("ethers");
const crypto = require("crypto");

/**
 * สร้างที่อยู่ Ethereum ที่กำหนดได้จาก user ID
 * สร้างที่อยู่ที่ไม่ซ้ำกันและสม่ำเสมอสำหรับแต่ละผู้ใช้โดยไม่ต้องให้ผู้ใช้มี wallet
 * @param {string} userId - MongoDB ObjectId หรือรหัสผู้ใช้
 * @returns {string} ที่อยู่ Ethereum (0x...)
 */
function generateAddressFromUserId(userId) {
  // สร้าง key pair ที่กำหนดได้จาก user ID
  const hash = crypto.createHash("sha256").update(userId.toString()).digest();
  const privateKey = Buffer.from(hash).toString("hex");
  
  // สร้าง wallet จาก private key
  const wallet = new ethers.Wallet(`0x${privateKey}`);
  return wallet.address;
}

/**
 * ตรวจสอบรูปแบบที่อยู่ Ethereum
 * @param {string} address - ที่อยู่ที่ต้องการตรวจสอบ
 * @returns {boolean}
 */
function isValidAddress(address) {
  try {
    return ethers.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * ดึงหรือสร้างที่อยู่ blockchain สำหรับผู้ใช้
 * ถ้าผู้ใช้มี blockchainAddress อยู่แล้วให้ใช้ค่านั้น มิฉะนั้นให้สร้างใหม่แบบกำหนดได้และบันทึกลง database
 * @param {Object} user - เอกสารผู้ใช้จาก database
 * @returns {Promise<string>} ที่อยู่ Ethereum
 */
async function getOrGenerateBlockchainAddress(user) {
  if (user.blockchainAddress && isValidAddress(user.blockchainAddress)) {
    return user.blockchainAddress;
  }
  
  // สร้างที่อยู่แบบกำหนดได้จาก user ID
  const blockchainAddress = generateAddressFromUserId(user._id);
  
  // บันทึกลง database ถ้ายังไม่ได้บันทึก
  if (!user.blockchainAddress) {
    user.blockchainAddress = blockchainAddress;
    await user.save();
  }
  
  return blockchainAddress;
}

module.exports = {
  generateAddressFromUserId,
  isValidAddress,
  getOrGenerateBlockchainAddress,
};








