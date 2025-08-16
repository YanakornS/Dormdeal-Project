const express = require("express");
const router = express.Router();
const modController = require("../controllers/mod.controller");
const authJwt = require("../middlewares/auth.middleware");

// ดึงโพสต์ทั้งหมดของ Mod
router.get("/", 
  authJwt.verifyToken, 
  /**
   * #swagger.tags = ['Mod']
   * #swagger.summary = 'ดึงโพสต์ทั้งหมดสำหรับ Mod'
   * #swagger.path = '/mod/'
   */
  modController.getAllPostsByMod
);

// ดึงโพสต์ตาม ID สำหรับ Mod
router.get("/:id", 
  /**
   * #swagger.tags = ['Mod']
   * #swagger.summary = 'ดึงโพสต์ตาม ID สำหรับ Mod'
   * #swagger.path = '/mod/{id}'
   */
  modController.getPostByIdMod
);

// รีวิวโพสต์โดย Mod
router.patch("/review/:id", 
  authJwt.verifyToken, 
  authJwt.isMod, 
  /**
   * #swagger.tags = ['Mod']
   * #swagger.summary = 'รีวิวโพสต์โดย Mod'
   * #swagger.path = '/mod/review/{id}'
   */
  modController.reviewPost
);

// ลบโพสต์โดย Mod
router.delete("/:id", 
  authJwt.verifyToken, 
  /**
   * #swagger.tags = ['Mod']
   * #swagger.summary = 'ลบโพสต์โดย Mod'
   * #swagger.path = '/mod/{id}'
   */
  modController.deletePostByMod
);

// ดึงโพสต์ของเจ้าของ
router.get("/owner/:id", 
  /**
   * #swagger.tags = ['Mod']
   * #swagger.summary = 'ดึงโพสต์ของเจ้าของ'
   * #swagger.path = '/mod/owner/{id}'
   */
  modController.getPostByOwner
);
router.patch("/change-password",authJwt.verifyToken,modController.changePassword)
module.exports = router;
