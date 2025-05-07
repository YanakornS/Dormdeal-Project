const express = require("express");
const router = express.Router();
const { toggleWishlist, getUserWishlist } = require("../controllers/wishlist.controller");
const authJwt = require("../middlewares/auth.middleware");

router.post("/toggle", authJwt.verifyToken, toggleWishlist);
router.get("/", authJwt.verifyToken, getUserWishlist);

module.exports = router;
