const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/maincategory.controller");
const authJwt = require("../middlewares/auth.middleware");
const { upload, uploadToFirebase } = require("../middlewares/file.midleware");

// เพิ่มหมวดหมู่
router.post("/",
  /**
   * #swagger.tags = ['Maincategory']
   * #swagger.summary = 'เพิ่มหมวดหมู่หลัก'
   * #swagger.path = '/maincategory'
   * #swagger.consumes = ['multipart/form-data']
   * #swagger.parameters['name'] = { description: 'ชื่อหมวดหมู่', required: true, type: 'string' }
   * #swagger.parameters['image'] = { description: 'รูปภาพหมวดหมู่', required: true, type: 'file' }
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  upload,
  uploadToFirebase,
  authJwt.isMod,
  categoryController.addCategory
);

// ดึงหมวดหมู่ทั้งหมด
router.get("/",
  /**
   * #swagger.tags = ['Maincategory']
   * #swagger.summary = 'ดึงข้อมูลหมวดหมู่ทั้งหมด'
   * #swagger.path = '/maincategory'
   */
  categoryController.getCategory
);

// ดึงหมวดหมู่ตาม ID
router.get("/:id",
  /**
   * #swagger.tags = ['Maincategory']
   * #swagger.summary = 'ดึงข้อมูลหมวดหมู่ตาม ID'
   * #swagger.path = '/maincategory/{id}'
   * #swagger.parameters['id'] = { description: 'รหัสหมวดหมู่', required: true, type: 'string', in: 'path' }
   */
  categoryController.getCategoryById
);

// อัปเดตหมวดหมู่
router.put("/:id",
  /**
   * #swagger.tags = ['Maincategory']
   * #swagger.summary = 'อัปเดตหมวดหมู่'
   * #swagger.path = '/maincategory/{id}'
   * #swagger.consumes = ['multipart/form-data']
   * #swagger.parameters['id'] = { description: 'รหัสหมวดหมู่', required: true, type: 'string', in: 'path' }
   * #swagger.parameters['name'] = { description: 'ชื่อหมวดหมู่ใหม่', type: 'string' }
   * #swagger.parameters['image'] = { description: 'รูปภาพใหม่', type: 'file' }
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  upload,
  uploadToFirebase,
  authJwt.isMod,
  categoryController.updateCategory
);

// ลบหมวดหมู่
router.delete("/:id",
  /**
   * #swagger.tags = ['Maincategory']
   * #swagger.summary = 'ลบหมวดหมู่'
   * #swagger.path = '/maincategory/{id}'
   * #swagger.parameters['id'] = { description: 'รหัสหมวดหมู่', required: true, type: 'string', in: 'path' }
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isMod,
  categoryController.deleteCategory
);

module.exports = router;
