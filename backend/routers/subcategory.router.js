const express = require("express");
const router = express.Router();
const subcategory = require("../controllers/subcategory.controller");
const authJwt = require("../middlewares/auth.middleware");

// เพิ่มหมวดย่อย
router.post("/",
  /**
   * #swagger.tags = ['Subcategory']
   * #swagger.summary = 'เพิ่มหมวดย่อย'
   * #swagger.path = '/subcategory'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  // authJwt.verifyToken,
  // authJwt.isMod,
  subcategory.addSubCategory
);

// ดึงหมวดย่อยทั้งหมด
router.get("/sub",
  /**
   * #swagger.tags = ['Subcategory']
   * #swagger.summary = 'ดึงข้อมูลหมวดย่อยทั้งหมด'
   * #swagger.path = '/subcategory/sub'
   */
  subcategory.getSubCategories
);

// ดึงหมวดย่อยตาม ID
router.get("/:id",
  /**
   * #swagger.tags = ['Subcategory']
   * #swagger.summary = 'ดึงข้อมูลหมวดย่อยตาม ID'
   * #swagger.path = '/subcategory/{id}'
   */
  subcategory.getSubCategoryById
);

// อัปเดตหมวดย่อย
router.put("/:id",
  /**
   * #swagger.tags = ['Subcategory']
   * #swagger.summary = 'อัปเดตหมวดย่อย'
   * #swagger.path = '/subcategory/{id}'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isMod,
  subcategory.updateSubCategory
);

// ลบหมวดย่อย
router.delete("/:id",
  /**
   * #swagger.tags = ['Subcategory']
   * #swagger.summary = 'ลบหมวดย่อย'
   * #swagger.path = '/subcategory/{id}'
   * #swagger.security = [{ "bearerAuth": [] }]
   */
  authJwt.verifyToken,
  authJwt.isMod,
  subcategory.deleteSubCategory
);

module.exports = router;
