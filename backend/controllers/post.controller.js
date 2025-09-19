const PostModel = require("../models/post.model");
const MainCategory = require("../models/maincategory.model");
const UserModel = require("../models/user.model");
const NotificationModel = require("../models/notification.model")
const MessageModel = require("../models/message.model")
const RatingModel = require("../models/rating.model");

//createPost
exports.createPost = async (req, res) => {
  if (!req.fileUrls || req.fileUrls.length === 0) {
    return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพประกอบโพสต์" });
  }

  //const firebaseUrl = req.files.firebaseUrl;
  const owner = req.userId;
  //สลายโครงสร้าง
  const {
    postType,
    productName,  
    category,
    subcategory,
    price,
    description,
    condition,
    postPaymentType,
  } = req.body;
  if (
    !postType ||
    !productName ||
    !category ||
    !subcategory ||
    !price ||
    !description ||
    !condition ||
    !postPaymentType
  ) {
    return res.status(400)
    //.json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนโพสต์" });
  }
  try {
    const userDoc = await UserModel.findById(owner);
    if (!userDoc) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }
    const userPostCount = await PostModel.countDocuments({
    owner,
    postType, 
    status: { $in: ["pending_review", "approved", "needs_revision"] }
});
  if (userPostCount >= 5) {
  return res.status(403).json({
    message: "คุณไม่สามารถลงประกาศประเภท " + postType + " ได้เกิน 5 รายการ กรุณาจัดการโพสต์ของคุณก่อน",
  });
}
    if (userDoc.userStatus !== "normal") {
      return res.status(403).json({ message: "บัญชีของคุณถูกระงับการหรืออยู้ในสถานะพ้นสภาพนักศึกษา " });
    }
    const categoryDoc = await MainCategory.findById(category);
    if (!categoryDoc)
      return res.status(404).json({ message: "ไม่พบหมวดหมู่ที่เลือก" });

    // method find ใช้หาสมาชิกตัวเเรกของarray
    const matchedSub = categoryDoc.subCategories.find((sub) => sub._id.toString() === subcategory);
    if (!matchedSub)
      return res.status(404).json({ message: "ไม่พบหมวดหมู่ย่อยที่เลือก" });


    const postDoc = await PostModel.create({
      owner,
      postType,
      productName,
      category: categoryDoc._id,
      subcategory: matchedSub._id, 
      images: req.fileUrls,
      price,
      description,
      condition,
      postPaymentType,
    });
    
    res.json({message:"โพสต์ถูกสร้างเรียบร้อยแล้ว",post:postDoc});
    
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      message:"เกิดข้อผิดพลาดระหว่างการสร้างโพสต์ กรุณาลองใหม่ภายหลัง",
    });
  }
};

exports.uploadPaymentSlip = async (req, res) => {
  try {
    const postId = req.params.id;

    const current = await PostModel.findById(postId).select(
      "paymentStatus slipTransactionRef"
    );
    
    if (!current) {
      return res.status(404).json({ message: "ไม่พบโพสต์" });
    }

    if (current.paymentStatus === "confirmed" || current.slipTransactionRef) {
      return res.status(409).json({ message: "โพสต์นี้ชำระเงินแล้ว" });
    }

    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      {
        slipImageUrl: req.file.firebaseUrl,
        paymentStatus: "confirmed",
        status: "pending_review",
        slipTransactionRef: req.slipMeta?.transactionRef || null,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "ไม่พบโพสต์" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("UploadSlip error:", error.message);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในระบบ" });
  }
};

// getAllPost
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ status: "approved" })
      // ใช้ populate เพื่อดึงข้อมูลจากคอลเลกชันที่เชื่อมโยง (ในที่นี้คือข้อมูลเจ้าของโพสต์)
      .populate("category", ["name"])
      .populate("owner", ["displayName"])

      // เรียงลำดับโดยให้ Paid มาก่อน และเรียง createdAt ใหม่สุด
      .sort({
        postPaymentType: -1, // ให้ "Paid" อยู่บนสุด
        createdAt: -1, // แล้วเรียงตามวันที่ใหม่สุด
      })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).send({
      message: "ไม่สามารถโหลดโพสต์ได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
    });
  }
};

// ดึงโพสต์ตาม postType (WTB หรือ WTS)
exports.getPostsByType = async (req, res) => {
  try {
    const { type } = req.query; // รับ ?type=wts หรือ ?type=wtb

    if (!type) {
      return res.status(400).json({ message: "กรุณาระบุ type เป็น WTS หรือ WTB" });
    }

    // แปลงเป็นตัวใหญ่เพื่อ match postType ใน DB
    const postType = type.toUpperCase();

    const posts = await PostModel.find({ status: "approved", postType })
      .populate("category", ["name"])
      .populate("owner", ["displayName"])
      .sort({ postPaymentType: -1, createdAt: -1 });

    return res.json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดระหว่างดึงโพสต์" });
  }
};




exports.getWTBPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ status: "approved", postType: "WTB" })
      .populate("category", ["name"])
      .populate("owner", ["displayName"])
      .sort({ postPaymentType: -1, createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).send({
      message: "ไม่สามารถโหลดโพสต์ WTB ได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
    });
  }
};

exports.getWTSPosts = async (req, res) => {
  try {
    const posts = await PostModel.find({ status: "approved", postType: "WTS" })
      .populate("category", ["name"])
      .populate("owner", ["displayName"])
      .sort({ postPaymentType: -1, createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).send({
      message: "ไม่สามารถโหลดโพสต์ WTS ได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
    });
  }
};

//getPostById
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await PostModel.findById(id)
    .populate("owner", ["displayName", "photoURL"])
    .populate("category", ["name"]);
    if (!postDoc) {
      res.status(404).send({message: "ไม่พบโพสต์ที่ต้องการ",});
      return;
    }
    res.json(postDoc);
  } catch (error) {
    res.status(500).send({
      message: "เกิดข้อผิดพลาดระหว่างโหลดข้อมูลโพสต์",
    });
  }
};

//deletePost ByOwner
exports.deletePostByOwner = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.userId;

  try {
    const postDoc = await PostModel.findById(id);
    if (!postDoc) {
      return res.status(404).send({
        message: "ไม่พบโพสต์ที่ต้องการลบ"
      });
    }
    if (ownerId !== postDoc.owner.toString()) {
      return res.status(403).send({
        message: "คุณไม่มีสิทธิ์ลบโพสต์นี้ เพราะคูณไม่ใช่เจ้าของโพสต์นี้",
      });
    }
    await PostModel.findByIdAndDelete(id);
    res.status(200).send({
      message: "ลบโพสต์เรียบร้อยแล้ว",
    });
  } catch (error) {
    res.status(500).send({
      message:  "เกิดข้อผิดพลาดระหว่างการลบโพสต์",
    });
  }
};

//getPostByOwner
exports.getPostByOwner = async (req, res) => {
  const { id } = req.params;
  try {
    // ค้นหาโพสต์ทั้งหมดที่เจ้าของเป็น `id` ที่ได้รับจาก URL
    const postDoc = await PostModel.find({ owner: id })
      // ใช้ populate เพื่อดึงข้อมูลเจ้าของโพสต์
      .populate("owner");

    // ถ้าไม่พบโพสต์ที่มีเจ้าของ `id` นี้
    if (!postDoc) {
      res.status(404).send({
        message: "ไม่พบโพสต์ของผู้ใช้นี้",
      });
      return;
    }
    // ส่งข้อมูลโพสต์ทั้งหมดที่พบกลับไปยัง client
    res.json(postDoc);
  } catch (error) {
    res.status(500).send({
      message: "เกิดข้อผิดพลาดระหว่างการโหลดโพสต์ของผู้ใช้นี้",
    });
  }
};

//updatePostById
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.userId;

  if (!id) return res.status(404).json({ message: "ไม่พบ ID ของโพสต์" });

  try {
    const postDoc = await PostModel.findById(id);

    if (!postDoc) {
      return res.status(404).json({ message: "ไม่พบโพสต์ที่ต้องการอัปเดต" });
    }

    if (ownerId !== postDoc.owner.toString()) {
      return res.status(403).send({
        message: "คุณไม่มีสิทธิ์แก้ไขโพสต์นี้ เพราะคุณไม่ใช่เจ้าของโพสต์นี้",
      });
    }

    const {
      productName,
      category,
      subcategory,
      price,
      description,
      condition,
      postType,
      postPaymentType,
    } = req.body;

    if (
      !productName ||
      !category ||
      !subcategory ||
      !price ||
      !description ||
      !condition ||
      !postType ||
      !postPaymentType
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่อง" });
    }

    // อัปเดตฟิลด์
    postDoc.productName = productName;
    postDoc.category = category;
    postDoc.subcategory = subcategory;
    postDoc.price = price;
    postDoc.description = description;
    postDoc.condition = condition;
    postDoc.postType = postType;
    postDoc.postPaymentType = postPaymentType;

    postDoc.status = "pending_review";
    postDoc.modNote = null;

    await postDoc.save();
     res.json(postDoc);
  } catch (error) {
    res.status(500).send({
      message:
        "เกิดข้อผิดพลาดระหว่างการอัปเดตโพสต์ กรุณาลองใหม่",
    });
  }
};

exports.getInterestedUsers = async (req, res) => {
  try {
    const { postId } = req.params;
    const sellerId = req.userId;

    // ตรวจสอบว่าเป็นเจ้าของโพสต์
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        message: "ไม่พบโพสต์นี้" 
      });
    }

    if (post.owner.toString() !== sellerId) {
      return res.status(403).json({ 
        success: false, 
        message: "ไม่มีสิทธิ์เข้าถึงข้อมูลนี้" 
      });
    }

    // หา user ที่เคยส่งข้อความเกี่ยวกับโพสต์นี้
    const messages = await MessageModel.find({ 
      postId,
      senderId: { $ne: sellerId } 
    }).populate('senderId', 'displayName photoURL rating')
      .sort({ createdAt: -1 });

    // สร้างรายชื่อที่ไม่ซ้ำกัน
    const interestedUsers = [];
    const userIds = new Set();

    messages.forEach(msg => {
      if (!userIds.has(msg.senderId._id.toString())) {
        userIds.add(msg.senderId._id.toString());
        interestedUsers.push({
          userId: msg.senderId._id,
          displayName: msg.senderId.displayName,
          photoURL: msg.senderId.photoURL,
          rating: msg.senderId.rating,
          lastMessage: msg.text || 'ส่งรูปภาพ',
          lastMessageTime: msg.createdAt
        });
      }
    });

    return res.json({
      success: true,
      data: {
        post: {
          id: post._id,
          productName: post.productName,
          price: post.price,
          status: post.status
        },
        interestedUsers,
        totalInterested: interestedUsers.length
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "เกิดข้อผิดพลาด กรุณาลองใหม่" 
    });
  }
};


exports.closePostAndNotify = async (req, res) => {
  try {
    const { postId } = req.params;
    const sellerId = req.userId;
    const { buyerIds } = req.body; 
    if (!buyerIds || !Array.isArray(buyerIds) || buyerIds.length === 0) {
      return res.status(400).json({ 
        message: "กรุณาระบุผู้ซื้ออย่างน้อยหนึ่งคน" 
      });
    }

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "ไม่พบโพสต์นี้" 
      });
    }

    if (post.owner.toString() !== sellerId) {
      return res.status(403).json({ 
        success: false, 
        message: "ไม่มีสิทธิ์ปิดการขายโพสต์นี้" 
      });
    }

    if (post.status === "sold") {
      return res.status(400).json({ 
        success: false, 
        message: "โพสต์นี้ถูกปิดการขายแล้ว" 
      });
    }

    post.status = "sold";
    post.buyers = buyerIds;
    post.buyer = buyerIds[0]; // เก็บผู้ซื้อหลักเป็นคนแรก
    await post.save();

    // แจ้งเตือนผู้ซื้อทั้งหมด
    const notifications = buyerIds.map(userId => ({
      recipient: userId,
      message: `ยินดีด้วย! คุณได้ซื้อสินค้า "${post.productName}" เรียบร้อยแล้ว กรุณาให้คะแนนผู้ขาย`,
      type: "purchase_success",
      post: post._id,
      seller: sellerId,
      requiresRating: true
    }));

    if (notifications.length > 0) {
      await NotificationModel.insertMany(notifications);
    }

    return res.json({ 
      success: true,
      message: "ปิดการขายและแจ้งเตือนผู้ซื้อสำเร็จ",
      data: {
        postId: post._id,
        productName: post.productName,
        notifiedUsers: buyerIds.length,
        buyers: buyerIds.length,
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาด กรุณาลองใหม่" 
    });
  }
};


exports.rateSeller = async (req, res) => {
  try {
    const { postId } = req.params;
    const buyerId = req.userId;
    const { rating } = req.body;

    // ตรวจสอบคะแนน
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: "กรุณาให้คะแนนระหว่าง 1-5" 
      });
    }

    // แปลงคะแนนเป็นตัวเลข
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) {
      return res.status(400).json({ 
        message: "คะแนนต้องเป็นตัวเลข" 
      });
    }

    // หาโพสต์และตรวจสอบว่าเป็นผู้ซื้อจริง
    const post = await PostModel.findById(postId).populate('owner', 'displayName rating');
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "ไม่พบโพสต์นี้" 
      });
    }

    if (post.status !== "sold") {
      return res.status(400).json({ 
        success: false, 
        message: "โพสต์นี้ยังไม่ได้ปิดการขาย" 
      });
    }

    
    if (!post.buyer || post.buyer.toString() !== buyerId) {
  return res.status(403).json({ 
    success: false, 
    message: "คุณไม่ได้เป็นผู้ซื้อสินค้าชิ้นนี้" 
  });
}

    // ตรวจสอบว่าได้ให้คะแนนแล้วหรือยัง
    const existingRating = await RatingModel.findOne({
      post: postId,
      rater: buyerId
    });

    if (existingRating) {
      return res.status(400).json({ 
        message: "คุณได้ให้คะแนนสินค้าชิ้นนี้แล้ว" 
      });
    }

    // บันทึกคะแนน
    const newRating = new RatingModel({
      post: postId,
      seller: post.owner._id,
      rater: buyerId,
      rating: numRating,
    });

    await newRating.save();

    // คำนวณคะแนนเฉลี่ยใหม่ของผู้ขาย
    const sellerRatings = await RatingModel.find({ seller: post.owner._id });
    const totalRating = sellerRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / sellerRatings.length;

    // อัปเดตคะแนนของผู้ขาย
    await UserModel.findByIdAndUpdate(post.owner._id, {
      'rating.score': Math.round(averageRating * 10) / 10,
      'rating.count': sellerRatings.length
    });

    // สร้างแจ้งเตือนให้ผู้ขาย
    const sellerNotification = new NotificationModel({
      recipient: post.owner._id,
      message: `คุณได้รับคะแนน ${numRating} ดาว จากการขายสินค้า "${post.productName}"`,
      type: "rating_received",
      post: postId,
      seller: post.owner._id,
      requiresRating: false
    });

    await sellerNotification.save();

    return res.json({
      message: "ให้คะแนนสำเร็จ",
      data: {
        postId: post._id,
        productName: post.productName,
        givenRating: numRating,
        sellerNewRating: {
          score: Math.round(averageRating * 10) / 10,
          count: sellerRatings.length
        }
      }
    });
  } catch (error) {
    console.error('Error in rateSeller:', error);
    return res.status(500).json({ 
      message: "เกิดข้อผิดพลาด กรุณาลองใหม่" 
    });
  }
};


