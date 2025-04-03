const PostModel = require("../models/post.model");
const MainCategory = require("../models/maincategory.model");

//createPost
exports.createPost = async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ message: "Image is required" });
  }
  //const firebaseUrl = req.files.firebaseUrl;
  const owner = req.userId;
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
    const categoryDoc = await MainCategory.findById(category);
    const subCategoryDoc = await MainCategory.findById(category);

    if (!categoryDoc) {
      return res.status(404).json({ message: "Category not found" });
    }
    if (!subCategoryDoc) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    const postDoc = await PostModel.create({
      owner,
      postType,
      productName,
      category: categoryDoc._id,
      subcategory: subCategoryDoc._id,
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
    // ค้นหาข้อมูลโพสต์ทั้งหมดจากฐานข้อมูล MongoDB
    const posts = await PostModel.find()
      // ใช้ populate เพื่อดึงข้อมูลจากคอลเลกชันที่เชื่อมโยง (ในที่นี้คือข้อมูลเจ้าของโพสต์)
      .populate("category", ["name"])
      .populate("owner", ["displayName"])

      // เรียงลำดับโดยให้ Paid มาก่อน และเรียง createdAt ใหม่สุด
      .sort({
        postPaymentType: -1, // ให้ "Paid" อยู่บนสุด
        createdAt: -1, // แล้วเรียงตามวันที่ใหม่สุด
      });

    // ส่งข้อมูลโพสต์ที่ได้กลับไปยัง client ในรูปแบบ JSON
    res.json(posts);
  } catch (error) {
    // ถ้ามีข้อผิดพลาดเกิดขึ้นในส่วน `try` จะมาที่นี่
    console.error(error.message);

    // ส่งข้อผิดพลาดกลับไปที่ client โดยให้รหัสสถานะ 500 (Internal Server Error)
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
      "displayName","photoURL",
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

    const { productName, category, price, description, condition } = req.body;

    if (!productName || !category || !price || !description || !condition) {
      return res.status(400).json({ message: "All fields are required" });
    }

    postDoc.productName = productName;
    postDoc.category = category;
    postDoc.price = price;
    postDoc.description = description;
    postDoc.condition = condition;

    if (req.files) {
      postDoc.images = req.fileUrls;
    }

    await postDoc.save();
    res.json(postDoc);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Something error occurred while updating a post",
    });
  }
};

// getAllPostByMod
exports.getAllPostsByMod = async (req, res) => {
  try {
    const posts = await PostModel.find()
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
      message: "An error occurred while fetching posts",
    });
  }
};

exports.deletePostByMod = async (req, res) => {
  const { id } = req.params;

  try {
    const postDoc = await PostModel.findById(id);

    if (!postDoc) {
      return res.status(404).send({
        message: "Post not found",
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
