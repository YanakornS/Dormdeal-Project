const PostModel = require("../models/post.model");
const MainCategory = require("../models/maincategory.model");
const UserModel = require("../models/user.model");
//createPost
exports.createPost = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "Image is required" });
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
    return res.status(400).json({ message: "All Fields is requires" });
  }
  try {
    const userDoc = await UserModel.findById(owner);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userDoc.userStatus !== "normal") {
      return res.status(403).json({ message: "User is banned or outof " });
    }
    const categoryDoc = await MainCategory.findById(category);
    if (!categoryDoc)
      return res.status(404).json({ message: "Category not found" });

    const matchedSub = categoryDoc.subCategories.find(
      (sub) => sub._id.toString() === subcategory
    );
    if (!matchedSub)
      return res.status(404).json({ message: "Subcategory not found" });

    const postDoc = await PostModel.create({
      owner,
      postType,
      productName,
      category: categoryDoc._id,
      subcategory: matchedSub._id, // ✅ ใช้ _id จาก subCategories array
      images: req.fileUrls,
      price,
      description,
      condition,
      postPaymentType,
    });
    if (!postDoc) {
      res.status(400).send({
        message: "Cannot Create new Post",
      });
      return;
    }
    res.json(postDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while creating a new Post.",
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
      message: "An error occurred while fetching posts",
    });
  }
};

//getPostById
exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await PostModel.findById(id).populate("owner", [
      "displayName",
      "photoURL",
      "category",
      "name",
      "subcategory",
      "subCategoryName",
    ]);
    if (!postDoc) {
      res.status(404).send({
        message: "Post not found",
      });
      return;
    }
    res.json(postDoc);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Something error occurred while getting post Details",
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
        message: "Post not found",
      });
    }

    if (ownerId !== postDoc.owner.toString()) {
      return res.status(403).send({
        message: "You are not authorized to delete this post",
      });
    }

    await PostModel.findByIdAndDelete(id);

    res.status(200).send({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message: error.message || "An error occurred while deleting the post",
    });
  }
};

//getPostByOwner
exports.getPostByOwner = async (req, res) => {
  const { id } = req.params;
  try {
    // ค้นหาโพสต์ทั้งหมดที่เจ้าของเป็น `id` ที่ได้รับจาก URL
    const postDoc = await PostModel.find({ owner: id })
      // ใช้ populate เพื่อดึงข้อมูลเจ้าของโพสต์ (เช่น ชื่อผู้ใช้)
      .populate("owner");

    // ถ้าไม่พบโพสต์ที่มีเจ้าของ `id` นี้
    if (!postDoc) {
      res.status(404).send({
        message: "Post not found",
      });
      return;
    }
    // ส่งข้อมูลโพสต์ทั้งหมดที่พบกลับไปยัง client
    res.json(postDoc);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      message: "Something error occurred while getting post by author",
    });
  }
};

//updatePostById
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const ownerId = req.userId;

  if (!id) return res.status(404).json({ message: "Post id is not Provided" });

  try {
    const postDoc = await PostModel.findById(id);

    if (!postDoc) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (ownerId !== postDoc.owner.toString()) {
      return res.status(403).send({
        message: "You cannot update this post",
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
      existingImages,
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
      return res.status(400).json({ message: "All fields are required" });
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

    //แปลง existingImages จาก JSON เป็น Array
    let oldImages = [];
    try {
      oldImages = JSON.parse(existingImages);
    } catch (e) {
      oldImages = [];
    }
    // รวมรูปภาพเก่าและรูปภาพใหม่จาก req.fileUrls เข้าด้วยกัน
    postDoc.images = req.fileUrls ? [...oldImages, ...req.fileUrls] : oldImages;

    // รีเซ็ตสถานะเพื่อให้ admin ตรวจสอบใหม่
    postDoc.status = "pending_review";
    postDoc.modNote = null;

    await postDoc.save();
    res.json(postDoc);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      message:
        error.message || "Something error occurred while updating a post",
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
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดระหว่างการปิดการขาย กรุณาลองใหม่ภายหลัง",
    });
  }
};
