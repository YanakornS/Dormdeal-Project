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
    // ค้นหาข้อมูลโพสต์ทั้งหมดจากฐานข้อมูล MongoDB
    const posts = await PostModel.find({ status: "approved" })
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

    // ✅ รวมภาพเก่าและใหม่
    let oldImages = [];
    try {
      oldImages = JSON.parse(existingImages);
    } catch (e) {
      oldImages = [];
    }

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

// getAllPostByMod
// exports.getAllPostsByMod = async (req, res) => {
//   try {
//     const posts = await PostModel.find()
//       .populate("category", ["name"])
//       .populate("owner", ["displayName"])
//       .sort({
//         postPaymentType: -1,
//         createdAt: 1,
//       });

//     res.json(posts);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send({
//       message: "An error occurred while fetching posts",
//     });
//   }
// };

// exports.deletePostByMod = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const postDoc = await PostModel.findById(id);

//     if (!postDoc) {
//       return res.status(404).send({
//         message: "Post not found",
//       });
//     }

//     await PostModel.findByIdAndDelete(id);

//     res.status(200).send({
//       message: "Post deleted successfully",
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send({
//       message: error.message || "An error occurred while deleting the post",
//     });
//   }
// };

// approve or reject post by mod
// exports.reviewPost = async (req, res) => {
//   const { id } = req.params;
//   const { action, message } = req.body;

//   try {
//     const postDoc = await PostModel.findById(id);
//     const validActions = ["approved", "rejected", "needs_revision"];

//     if (!postDoc) {
//       return res.status(404).json({ message: "Post not found." });
//     }

//     if (!validActions.includes(action)) {
//       return res.status(400).json({ message: "Invalid action." });
//     }

//     postDoc.status = action;
//     if (action === "needs_revision") {
//       if (!message || message.trim() === "") {
//         return res.status(400).json({ message: "Revision message is required." });
//       }
//       postDoc.modNote = message;
//     } else {
//       postDoc.modNote = null;
//     }

//     await postDoc.save();
//       // const responsePost = postDoc.toObject();
//       // if (responsePost.status !== "needs_revision") {
//       //   delete responsePost.modNote;
//       // }
//     res.json({
//       message: `Post status updated to '${action}'.`,
//       // post: responsePost,
//       post: postDoc,
//     });

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//       message: "An error occurred while reviewing the post.",
//       error: error.message,
//     });
//   }
// };
