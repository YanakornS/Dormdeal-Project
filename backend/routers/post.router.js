const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require("../middlewares/auth.middleware");
const { uploads, uploadsToFirebase } = require("../middlewares/file.midleware");

//http://localhost:5000/api/v1/post
router.post("/", authJwt.verifyToken, uploads, uploadsToFirebase, postController.createPost);

//http://localhost:5000/api/v1/post
router.get("", postController.getAllPosts);

//http://localhost:5000/api/v1/post/mod/getallposts
router.get("/mod/getallposts", authJwt.verifyToken, postController.getAllPostsByMod);

//http://localhost:5000/api/v1/post/id
router.get("/:id", postController.getPostById);

//http://localhost:5000/api/v1/post/owner/id
router.get("/owner/:id", postController.getPostByOwner);

//http://localhost:5000/api/v1/post/id
router.put("/:id", authJwt.verifyToken, uploads, uploadsToFirebase, postController.updatePost);

//http://localhost:5000/api/v1/post/id
router.delete("/:id", authJwt.verifyToken, postController.deletePostByOwner);

module.exports = router;
