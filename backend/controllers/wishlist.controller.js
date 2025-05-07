const UserModel = require("../models/user.model");

exports.toggleWishlist = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // เช็คว่า postId มีอยู่ใน wishlist แล้วหรือยัง
    const index = user.wishlist.findIndex(id => id.toString() === postId);

    if (index !== -1) {
      user.wishlist.splice(index, 1);
      await user.save();
      return res.json({  message: "Removed from wishlist", wishlist: user.wishlist });
    } else {
      user.wishlist.push(postId);
      await user.save();
      return res.json({  message: "Added to wishlist", wishlist: user.wishlist });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getUserWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate({
      path: "wishlist",
      populate: { path: "owner", select: "displayName" },
    });

    if (!user) return res.status(404).json({  message: "User not found" });

    res.json({ wishlist: user.wishlist });

  } catch (err) {
    res.status(500).json({
      message: "Something error occurred while Get a Wishlist",
      error: err.message,
    });
  }
};
