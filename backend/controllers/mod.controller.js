const PostModel = require("../models/post.model");

exports.getAllPostsByMod = async (req, res) => {
  try {

    // กรองก่อนว่ามีแค่ pemding_review
    const posts = await PostModel.find({
      status: { $in: ["pending_review", "needs_revision", "rejected", "sold-out"] }
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
      message: "An error occurred while fetching posts",
    });
  }
};

exports.getPostByIdMod = async (req, res) => {
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


exports.getPostByOwner = async (req, res) => {
  const { id } = req.params;

  try {
    const postDocs = await PostModel.find({ owner: id })
      .populate("owner", ["displayName", "photoURL"])
      .populate("category", ["name"]);

    res.json(postDocs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Error fetching posts by owner" });
  }
};



exports.reviewPost = async (req, res) => {
    const { id } = req.params;
    const { action, message } = req.body; 
  
    try {
      const postDoc = await PostModel.findById(id);
      const validActions = ["approved", "rejected", "needs_revision"];
  
      if (!postDoc) {
        return res.status(404).json({ message: "Post not found." });
      }
  
      if (!validActions.includes(action)) {
        return res.status(400).json({ message: "Invalid action." });
      }
  
      postDoc.status = action;  
      if (action === "needs_revision") {
        if (!message || message.trim() === "") {
          return res.status(400).json({ message: "Revision message is required." });
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
        message: `Post status updated to '${action}'.`,
        // post: responsePost,
        post: postDoc,
      });
      
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        message: "An error occurred while reviewing the post.",
        error: error.message,
      });
    }
  };
  

