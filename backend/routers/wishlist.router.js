const express = require("express");
const router = express.Router();
const { toggleWishlist, getUserWishlist } = require("../controllers/wishlist.controller");
const authJwt = require("../middlewares/auth.middleware");

// เพิ่ม/ลบ จากรายการโปรด (toggle)
router.post("/toggle",
  /**
   * #swagger.tags = ['Wishlist']
   * #swagger.summary = 'เพิ่มหรือเอาโพสต์ออกจากรายการที่ชื่นชอบ'
   * #swagger.path = '/wishlist/toggle'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  toggleWishlist
);

// ดึงรายการโปรดของผู้ใช้
router.get("/",
  /**
   * #swagger.tags = ['Wishlist']
   * #swagger.summary = 'ดึงข้อมูลรายการที่ชื่นชอบของผู้ใช้'
   * #swagger.path = '/wishlist'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  getUserWishlist
);


module.exports = router;
