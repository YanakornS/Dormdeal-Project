const PostModel = require("../models/post.model");
const MainCategory = require("../models/maincategory.model");
const UserModel = require("../models/user.model");
//createPost
exports.createPost = async (req, res) => {
  if (!req.files) {
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
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนโพสต์" });
  }
  try {
    const userDoc = await UserModel.findById(owner);
    if (!userDoc) {
      return res.status(404).json({ message: "ไม่พบข้อมูลผู้ใช้" });
    }

    const userPostCount = await PostModel.countDocuments({ owner });
    if (userPostCount >= 5) {
      return res.status(403).json({
        message: "คุณไม่สามารถลงประกาศได้มากกว่า 5 รายการ กรุณาจัดการโพสต์ประกาศของคุณก่อน",
      });
    }

    if (userDoc.userStatus !== "normal") {
      return res.status(403).json({ message: "บัญชีของคุณถูกระงับการหรืออยู้ในสถานะพ้นสภาพนักศึกษา " });
    }
    const categoryDoc = await MainCategory.findById(category);
    if (!categoryDoc)
      return res.status(404).json({ message: "ไม่พบหมวดหมู่ที่เลือก" });

    // method find ใช้หาสมาชิกตัวเเรกของarray
    const matchedSub = categoryDoc.subCategories.find(
      (sub) => sub._id.toString() === subcategory
    );
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
    
    res.json(postDoc);({
    message: "โพสต์ถูกสร้างเรียบร้อยแล้ว"
});
    
  } catch (error) {
    res.status(500).send({
      message:"เกิดข้อผิดพลาดระหว่างการสร้างโพสต์ กรุณาลองใหม่ภายหลัง",
    });
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
      });

    res.json(posts);
  } catch (error) {
    res.status(500).send({
      message: "ไม่สามารถโหลดโพสต์ได้ในขณะนี้ กรุณาลองใหม่ภายหลัง",
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

exports.closeSale = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { buyerId } = req.body;

  try {
    const post = await PostModel.findById(id);

    if (!post) {
      return res.status(404).json({ message: "ไม่พบโพสต์ที่ต้องการปิดการขาย" });
    }


    if (post.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "คุณไม่มีสิทธิ์ปิดการขายของโพสต์นี้" });
    }

    if (post.status === "sold") {
      return res.status(400).json({ message: "โพสต์นี้ถูกปิดการขายไปแล้ว" });
    }

    if (post.status !== "approved") {
      return res.status(400).json({
        message: "โพสต์นี้ยังไม่ได้รับการอนุมัติ ไม่สามารถปิดการขายได้",
      });
    }
    if (buyerId) {
      const buyer = await UserModel.findById(buyerId);
      if (!buyer) {
        return res.status(404).json({ message: "ไม่พบผู้ซื้อ" });
      }
      post.buyer = buyerId;
    }
    // อัปเดตสถานะเป็น 'sold'
    post.status = "sold";
    await post.save();

    res.status(200).json({
      message: "โพสต์ถูกปิดการขายเรียบร้อยแล้ว",
    });


    if (post.owner.toString() !== userId) {
      return res.status(403).json({ message: "คุณไม่มีสิทธิ์ปิดการขายของโพสต์นี้" });
    }

    if (post.status === "sold") {
    return res.status(400).json({ message: "โพสต์นี้ถูกปิดการขายไปแล้ว" });
    }

    if (post.status !== "approved") {
    return res.status(400).json({
    message: "โพสต์นี้ยังไม่ได้รับการอนุมัติ ไม่สามารถปิดการขายได้",
    });
}
    if (buyerId) {
      const buyer = await UserModel.findById(buyerId);
      if (!buyer) {
        return res.status(404).json({ message: "ไม่พบผู้ซื้อ" });
      }
      post.buyer = buyerId;
    }
    // อัปเดตสถานะเป็น 'sold'
    post.status = "sold";
    await post.save();

    res.status(200).json({
      message: "โพสต์ถูกปิดการขายเรียบร้อยแล้ว",
    });


  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดระหว่างการปิดการขาย กรุณาลองใหม่ภายหลัง",
    });
  }
};
