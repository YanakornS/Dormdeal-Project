const express = require("express");
const router = express.Router();
const modController = require("../controllers/mod.controller");
const authJwt = require("../middlewares/auth.middleware");

//http://localhost:5000/api/v1/post/mod/getallposts
router.get("/", authJwt.verifyToken, modController.getAllPostsByMod);

//http://localhost:5000/api/v1/post/id
router.get("/:id", modController.getPostByIdMod);

//http://localhost:5000/api/v1//mod/review/id
router.patch("/review/:id", authJwt.verifyToken,authJwt.isMod, modController.reviewPost);

//http://localhost:5000/api/v1/mod/id
router.delete("/:id", authJwt.verifyToken, modController.deletePostByMod);

module.exports = router;
