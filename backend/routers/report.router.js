// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller")
const authJwt = require("../middlewares/auth.middleware");

// สร้างรายงาน
router.post("/",
  /**
   * #swagger.tags = ['Report']
   * #swagger.summary = 'สร้างรายงานโพสต์'
   * #swagger.path = '/report'
   */
  reportController.createReport
);

// ดึงรายงานทั้งหมด (MOD เท่านั้น)
router.get("/",
  /**
   * #swagger.tags = ['Report']
   * #swagger.summary = 'ดึงข้อมูลรายงานทั้งหมด'
   * #swagger.path = '/report'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isMod,
  reportController.getAllReports
);

// ดึงรายงานตาม ID (MOD เท่านั้น)
router.get("/:id",
  /**
   * #swagger.tags = ['Report']
   * #swagger.summary = 'ดึงข้อมูลรายงานตาม ID'
   * #swagger.path = '/report/{id}'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isMod,
  reportController.getReportById
);

// ลบรายงานตาม ID (MOD เท่านั้น)
router.delete("/:id",
  /**
   * #swagger.tags = ['Report']
   * #swagger.summary = 'ลบรายงานตาม ID'
   * #swagger.path = '/report/{id}'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isMod,
  reportController.deleteReport
);


module.exports = router;
