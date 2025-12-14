const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const blockchainService = require("../libs/blockchain/service");
const { getOrGenerateBlockchainAddress } = require("../libs/blockchain/utils");

exports.getAllPostsByMod = async (req, res) => {
  try {
     
    // กรองก่อนว่ามีแค่ pemding_review
    const posts = await PostModel.find({
      status: "pending_review",
      postType: { $in: ["WTB", "WTS"] },
    })
      .populate("category", ["name"])
      .populate("owner", ["displayName"])
      .sort({
        postPaymentType: -1,
        createdAt: 1,
      });

    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์",
    });
  }
};

exports.getPostByIdMod = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await PostModel.findById(id).populate("owner", [
      "displayName",
      "photoURL",
    ]);
    if (!postDoc) {
      res.status(404).send({
        message: "ไม่พบโพสต์ที่ระบุ",
      });
      return;
    }
    res.json(postDoc);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "เกิดข้อผิดพลาดขณะดึงรายละเอียดโพสต์",
    });
  }
};

exports.deletePostByMod = async (req, res) => {
  const { id } = req.params;
  const { modNote } = req.body; // รับ modNote จาก payload (ถ้ามี)

  try {
    const postDoc = await PostModel.findById(id).populate("owner");

    if (!postDoc) {
      return res.status(404).send({
        message: "ไม่พบโพสต์ที่ระบุ",
      });
    }

    // Update post status to rejected และ modNote (ถ้ามี)
    const updateData = { status: "rejected" };
    if (modNote) {
      updateData.modNote = modNote;
    }
    await PostModel.findByIdAndUpdate(id, updateData);

    // บันทึก penalty ลงบน blockchain (ถ้า blockchain service เปิดใช้งาน)
    let blockchainResult = null;
    let penaltyAlreadyExists = false;
    let ownerBlockchainAddress = null;
    if (blockchainService.isEnabled()) {
      try {
        const owner = postDoc.owner;
        if (!owner) {
          console.warn("Post owner not found, skipping blockchain penalty");
        } else {
          ownerBlockchainAddress = await getOrGenerateBlockchainAddress(owner);
          
          // ตรวจสอบว่าเคยลงโทษบน blockchain แล้วหรือยัง
          const alreadyPenalized = await blockchainService.hasPenalized(
            ownerBlockchainAddress,
            id
          );

          if (!alreadyPenalized) {
            // บันทึก penalty ลงบน blockchain (0.2 คะแนน)
            blockchainResult = await blockchainService.logPenalty(
              ownerBlockchainAddress,
              id
            );

            console.log("Penalty logged to blockchain:", blockchainResult.transactionHash);
            
            // อัปเดต rating ใน database จาก blockchain reputation (รวม penalty แล้ว)
            try {
              const blockchainReputation = await blockchainService.getReputation(ownerBlockchainAddress);
              await UserModel.findByIdAndUpdate(owner._id, {
                'rating.score': Math.max(0, Math.round(blockchainReputation.reputation * 10) / 10),
                'rating.count': blockchainReputation.ratingCount
              });
            } catch (updateError) {
              console.error("Failed to update rating from blockchain:", updateError.message);
            }
          } else {
            penaltyAlreadyExists = true;
            console.log("Penalty already exists on blockchain for this post");
            
            // อัปเดต rating ใน database จาก blockchain reputation (รวม penalty แล้ว)
            try {
              const blockchainReputation = await blockchainService.getReputation(ownerBlockchainAddress);
              await UserModel.findByIdAndUpdate(owner._id, {
                'rating.score': Math.max(0, Math.round(blockchainReputation.reputation * 10) / 10),
                'rating.count': blockchainReputation.ratingCount
              });
            } catch (updateError) {
              console.error("Failed to update rating from blockchain:", updateError.message);
            }
          }
        }
      } catch (blockchainError) {
        console.error("Failed to log penalty to blockchain:", blockchainError.message);
      }
    }

    res.status(200).send({
      message: "โพสต์ถูกตั้งสถานะเป็น 'rejected' เรียบร้อยแล้ว",
      blockchain: blockchainResult ? {
        transactionHash: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
      } : penaltyAlreadyExists && ownerBlockchainAddress ? {
        address: ownerBlockchainAddress,
        message: "Penalty already exists on blockchain for this post"
      } : null,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: error.message || "เกิดข้อผิดพลาดขณะลบโพสต์",
    });
  }
};

exports.getPostByOwner = async (req, res) => {
  const { id } = req.params;

  try {
    const postDocs = await PostModel.find({ owner: id })

      .populate("owner", ["displayName", "photoURL"])

      .populate("category", ["name"]);

    res.json(postDocs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงโพสต์ของเจ้าของ" });
  }
};

exports.reviewPost = async (req, res) => {
  const { id } = req.params;
  const { action, message } = req.body;

  try {
    const postDoc = await PostModel.findById(id);
    const validActions = ["approved", "rejected", "needs_revision"];

    if (!postDoc) {
      return res.status(404).json({ message: "ไม่พบโพสต์ที่ระบุ." });
    }

    if (!validActions.includes(action)) {
      return res.status(400).json({ message: "การดำเนินการไม่ถูกต้อง." });
    }

    postDoc.status = action;
    if (["needs_revision", "rejected"].includes(action)) {
      if (!message || message.trim() === "") {
        return res.status(400).json({
          message: "กรุณาระบุข้อความสำหรับหมายเหตุของผู้ตรวจสอบ (modNote)",
        });
      }
      postDoc.modNote = message;
    } else {
      postDoc.modNote = null;
    }

    await postDoc.save();
    // const responsePost = postDoc.toObject();
    // if (responsePost.status !== "needs_revision") {
    //   delete responsePost.modNote;
    // }
    res.json({
      message: `สถานะโพสต์ถูกเปลี่ยนเป็น '${action}' เรียบร้อยแล้ว'.`,
      // post: responsePost,
      post: postDoc,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดขณะตรวจสอบโพสต์",
    });
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

    // ตรวจสอบว่ารหัสผ่านใหม่เหมือนรหัสผ่านเก่าหรือไม่
    if (user.password) {
      const isSame = await bcrypt.compare(newPassword, user.password);
      if (isSame) {
        return res
          .status(400)
          .json({ message: "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเก่า" });
      }
    }

    // hash รหัสผ่านใหม่
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // บันทึกลง DB
    await user.save();

    return res.status(200).json({ message: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาด", error: error.message });
  }
};
