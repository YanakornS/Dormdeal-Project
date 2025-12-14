const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
// const authJwt = require("../middlewares/auth.middleware");

// ลงชื่อเข้าใช้
router.post("/sign",
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'ลงชื่อเข้าใช้ผู้ใช้'
   * #swagger.path = '/user/sign'
   */
  userController.sign
);

// เพิ่มผู้ใช้ใหม่
router.post("/",
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'เพิ่มผู้ใช้ใหม่'
   * * #swagger.path = '/user/'
   */
  userController.addUser
);

// อัปเดตรูปโปรไฟล์ตามอีเมล
router.put("/photo",
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'อัปเดตรูปโปรไฟล์โดยใช้ email'
   * #swagger.path = '/user/photo'
   */
  userController.updatePhotoByEmail
);

// ดึงข้อมูล reputation จาก blockchain
router.get("/:id/reputation",
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = 'ดึงข้อมูล reputation จาก blockchain'
   * #swagger.path = '/user/{id}/reputation'
   */
  userController.getUserReputation
);

module.exports = router;
