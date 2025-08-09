const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authJwt = require("../middlewares/auth.middleware");

// ดึงข้อมูลผู้ใช้ทั้งหมด
router.get("/users",
  /**
   * #swagger.tags = ['Admin']
   * #swagger.summary = 'ดึงข้อมูลผู้ใช้ทั้งหมด'
   * #swagger.path = '/admin/users'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isAdmin,
  adminController.getAllUsers
);

// สร้างผู้ดูแลระบบ (MOD)
router.post("/",
  /**
   * #swagger.tags = ['Admin']
   * #swagger.summary = 'สร้างผู้ดูแลระบบ (MOD)'
   * #swagger.path = '/admin'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isAdmin,
  adminController.createMod
);

// อัปเดตสถานะผู้ใช้
router.put("/user-status",
  /**
   * #swagger.tags = ['Admin']
   * #swagger.summary = 'อัปเดตสถานะผู้ใช้'
   * #swagger.path = '/admin/user-status'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isAdmin,
  adminController.updateUserStatus
);

// เข้าสู่ระบบผู้ดูแลระบบ (MOD)
router.post("/mod-login",
  /**
   * #swagger.tags = ['Admin']
   * #swagger.summary = 'เข้าสู่ระบบผู้ดูแลระบบ (MOD)'
   * #swagger.path = '/admin/mod-login'
   */
  adminController.loginMod
);



module.exports = router;
