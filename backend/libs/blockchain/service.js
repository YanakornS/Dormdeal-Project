const { ethers } = require("ethers");
require("dotenv").config();

// ABI ของ Reputation Contract (ฟังก์ชันที่จำเป็นเท่านั้น)
const REPUTATION_ABI = [
  "function logRating(address seller, uint256 postId, uint256 rating) external",
  "function logPenalty(address seller, uint256 reportId) external",
  "function getReputation(address seller) external view returns (uint256)",
  "function getAverageRating(address seller) external view returns (uint256)",
  "function getTotalPenalty(address seller) external view returns (uint256)",
  "function getReputationDetails(address seller) external view returns (uint256 ratingSum, uint256 ratingCount, uint256 penaltySum, uint256 averageRating, uint256 reputation)",
  "function PENALTY_AMOUNT() external view returns (uint256)",
  "function hasRated(address seller, uint256 postId) external view returns (bool)",
  "function hasPenalized(address seller, uint256 reportId) external view returns (bool)",
  "event RatingLogged(address indexed seller, address indexed rater, uint256 indexed postId, uint256 rating, uint256 timestamp)",
  "event PenaltyLogged(address indexed seller, uint256 indexed reportId, uint256 penaltyAmount, uint256 timestamp)",
];

class BlockchainService {
  constructor() {
    // ดึง RPC URL จาก environment variables
    const rpcUrl =
      process.env.POLYGON_RPC_URL;

    if (!rpcUrl) {
      console.warn(
        "RPC_URL not set. Blockchain features will be disabled."
      );
      this.provider = null;
      this.signer = null;
      this.contract = null;
      this.enabled = false;
      return;
    }

    // เริ่มต้น provider
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // เริ่มต้น signer (relayer wallet)
    const relayerPrivateKey = process.env.RELAYER_PRIVATE_KEY;
    if (!relayerPrivateKey) {
      console.warn(
        "RELAYER_PRIVATE_KEY not set. Blockchain features will be disabled."
      );
      this.signer = null;
      this.contract = null;
      this.enabled = false;
      return;
    }

    this.signer = new ethers.Wallet(relayerPrivateKey, this.provider);

    // เริ่มต้น contract
    const contractAddress = process.env.REPUTATION_CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.warn(
        "REPUTATION_CONTRACT_ADDRESS not set. Blockchain features will be disabled."
      );
      this.contract = null;
      this.enabled = false;
      return;
    }

    this.contract = new ethers.Contract(
      contractAddress,
      REPUTATION_ABI,
      this.signer
    );
    this.enabled = true;

    console.log("Blockchain service initialized");
    console.log(`Contract: ${contractAddress}`);
    console.log(`Relayer: ${this.signer.address}`);
  }

  /**
   * ตรวจสอบว่า blockchain service เปิดใช้งานอยู่หรือไม่
   */
  isEnabled() {
    return this.enabled && this.contract !== null;
  }

  /**
   * บันทึก rating ลงบน blockchain
   * @param {string} sellerAddress - ที่อยู่ Ethereum ของผู้ขาย
   * @param {string|number} postId - รหัสโพสต์ที่ไม่ซ้ำกัน
   * @param {number} rating - คะแนน (1-5)
   * @returns {Promise<Object>}
   */
  async logRating(sellerAddress, postId, rating) {
    if (!this.isEnabled())
      throw new Error("Blockchain service is not enabled.");

    try {
      // แปลง MongoDB ObjectId เป็น BigInt (uint256)
      const postIdBigInt = ethers.toBigInt("0x" + postId.slice(0, 16));

      const tx = await this.contract.logRating(
        sellerAddress,
        postIdBigInt,
        rating,
        { gasLimit: 200000 }
      );

      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error("Error logging rating to blockchain:", error);
      throw new Error(`Failed to log rating: ${error.message}`);
    }
  }

  /**
   * บันทึก penalty ลงบน blockchain
   * @param {string} sellerAddress - ที่อยู่ Ethereum ของผู้ขาย
   * @param {string|number} reportId - รหัสรายงานที่ไม่ซ้ำกัน
   * @returns {Promise<Object>}
   */
  async logPenalty(sellerAddress, reportId) {
    if (!this.isEnabled()) {
      throw new Error(
        "Blockchain service is not enabled. Check your configuration."
      );
    }

    try {
      // แปลง MongoDB ObjectId เป็น BigInt (uint256)
      const reportIdBigInt = ethers.toBigInt("0x" + reportId.slice(0, 16));

      // เรียกใช้ฟังก์ชันของ smart contract
      const tx = await this.contract.logPenalty(sellerAddress, reportIdBigInt, {
        gasLimit: 200000,
      });

      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      };
    } catch (error) {
      console.error("Error logging penalty to blockchain:", error);
      throw new Error(`Failed to log penalty: ${error.message}`);
    }
  }

  /**
   * ดึงคะแนน reputation จาก blockchain
   * @param {string} sellerAddress - ที่อยู่ Ethereum ของผู้ขาย
   * @returns {Promise<Object>} รายละเอียด reputation
   */
  async getReputation(sellerAddress) {
    if (!this.isEnabled()) {
      throw new Error(
        "Blockchain service is not enabled. Check your configuration."
      );
    }

    try {
      // เรียกใช้ view functions (ไม่ต้องใช้ gas)
      const [details] = await Promise.all([
        this.contract.getReputationDetails(sellerAddress),
      ]);

      // แปลง BigInt เป็นตัวเลข (reputation ถูก scale ด้วย 1e18)
      const SCALE = BigInt(10 ** 18);

      const ratingSum = Number(details.ratingSum);
      const ratingCount = Number(details.ratingCount);
      const penaltySum = Number(details.penaltySum) / Number(SCALE);
      const averageRating = Number(details.averageRating) / Number(SCALE);
      const reputation = Number(details.reputation) / Number(SCALE);

      return {
        ratingSum,
        ratingCount,
        penaltySum,
        averageRating: parseFloat(averageRating.toFixed(2)),
        reputation: Math.max(0, parseFloat(reputation.toFixed(2))), // ไม่เป็นค่าติดลบ
      };
    } catch (error) {
      console.error("Error getting reputation from blockchain:", error);
      throw new Error(`Failed to get reputation: ${error.message}`);
    }
  }

  /**
   * ตรวจสอบว่าเคยให้ rating สำหรับโพสต์นี้แล้วหรือยัง
   * @param {string} sellerAddress - ที่อยู่ Ethereum ของผู้ขาย
   * @param {string|number} postId - รหัสโพสต์ที่ไม่ซ้ำกัน
   * @returns {Promise<boolean>}
   */
  async hasRated(sellerAddress, postId) {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      // แปลง MongoDB ObjectId เป็น BigInt (uint256)
      const postIdBigInt = ethers.toBigInt("0x" + postId.slice(0, 16));

      return await this.contract.hasRated(sellerAddress, postIdBigInt);
    } catch (error) {
      console.error("Error checking rating status:", error);
      return false;
    }
  }

  /**
   * ตรวจสอบว่าเคยลงโทษสำหรับรายงานนี้แล้วหรือยัง
   * @param {string} sellerAddress - ที่อยู่ Ethereum ของผู้ขาย
   * @param {string|number} reportId - รหัสรายงานที่ไม่ซ้ำกัน
   * @returns {Promise<boolean>}
   */
  async hasPenalized(sellerAddress, reportId) {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      // แปลง MongoDB ObjectId เป็น BigInt (uint256)
      const reportIdBigInt = ethers.toBigInt("0x" + reportId.slice(0, 16));
      
      return await this.contract.hasPenalized(sellerAddress, reportIdBigInt);
    } catch (error) {
      console.error("Error checking penalty status:", error);
      return false;
    }
  }

  /**
   * ดึงค่าคงที่ของ penalty amount จาก contract
   * @returns {Promise<number>}
   */
  async getPenaltyAmount() {
    if (!this.isEnabled()) {
      return 0.2; // ค่าเริ่มต้น
    }

    try {
      const penaltyBigInt = await this.contract.PENALTY_AMOUNT();
      return Number(penaltyBigInt) / 10 ** 18;
    } catch (error) {
      console.error("Error getting penalty amount:", error);
      return 0.2;
    }
  }
}

module.exports = new BlockchainService();
