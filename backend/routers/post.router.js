const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require("../middlewares/auth.middleware");
const { upload, uploadToFirebase, uploads, uploadsToFirebase } = require("../middlewares/file.midleware");
const verifySlipWithEasySlip = require("../middlewares/easyslip.middleware")

//http://localhost:5000/api/v1/post

router.post(
  "/",
  authJwt.verifyToken,
  uploads,
  uploadsToFirebase,
  postController.createPost
);

router.post("/", authJwt.verifyToken, uploads,uploadsToFirebase, postController.createPost)

router.post("/:id/upload-slip", authJwt.verifyToken, upload, verifySlipWithEasySlip, uploadToFirebase, postController.uploadPaymentSlip);


//http://localhost:5000/api/v1/post
router.get("", postController.getAllPosts);

// //http://localhost:5000/api/v1/post/mod/getallposts
// router.get("/mod/getallposts", authJwt.verifyToken, postController.getAllPostsByMod);

//http://localhost:5000/api/v1/post/owner/id
router.get("/owner/:id", postController.getPostByOwner);

//http://localhost:5000/api/v1/post/id
router.get("/:id", postController.getPostById);

//http://localhost:5000/api/v1/post/id
router.put(
  "/:id",
  authJwt.verifyToken,
  uploads,
  uploadsToFirebase,
  postController.updatePost
);

//http://localhost:5000/api/v1/post/id
router.delete("/:id", authJwt.verifyToken, postController.deletePostByOwner);

router.get('/:postId/interested-users', authJwt.verifyToken, postController.getInterestedUsers);

// ปิดการขายและแจ้งเตือน
router.patch('/:postId/close', authJwt.verifyToken, postController.closePostAndNotify);

// ให้คะแนนผู้ขาย
router.post('/:postId/rate', authJwt.verifyToken, postController.rateSeller);

module.exports = router;
