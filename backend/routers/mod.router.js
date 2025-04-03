const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require("../middlewares/auth.middleware");
const { uploads, uploadsToFirebase } = require("../middlewares/file.midleware");


//http://localhost:5000/api/v1/post/mod
router.get("/", authJwt.verifyToken, postController.getAllPostsByMod);

//http://localhost:5000/api/v1/post/mod/
router.delete("/:id", authJwt.verifyToken, postController.deletePostByMod);

module.exports = router;
