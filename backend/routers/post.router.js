const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const authJwt = require("../middlewares/auth.middleware");
const {
  upload,
  uploadToFirebase,
  uploads,
  uploadsToFirebase,
} = require("../middlewares/file.midleware");
const verifySlipWithEasySlip = require("../middlewares/easyslip.middleware");

//เปลี่ยนpath
// ดึงโพสต์ทั้งหมด
router.get(
  "/get-all",
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'ดึงโพสต์ทั้งหมด'
   * #swagger.path = '/post/get-all'
   */
  postController.getAllPosts
)
//ดึงโพสต์ประเภท WTB
router.get
("/get-wtb", 
  postController.getWTBPosts
);

//ดึงโพสต์ประเภท WTS
router.get
("/get-wts", 
  postController.getWTSPosts
);

//เปลี่ยนpath
// สร้างโพสต์ใหม่
router.post(
  "/create",
  authJwt.verifyToken,
  uploads,
  uploadsToFirebase,
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'สร้างโพสต์ใหม่'
   * #swagger.path = '/post/create'
   * #swagger.parameters['files'] = { in: 'formData', type: 'file', required: true, description: 'รูปภาพประกอบโพสต์', collectionFormat: 'multi' }
   */
  postController.createPost
);

// อัปโหลดสลิปการชำระเงิน
router.post(
  "/:id/upload-slip",
  authJwt.verifyToken,
  upload,
  verifySlipWithEasySlip,
  uploadToFirebase,
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'อัปโหลดสลิปการชำระเงิน'
   * #swagger.path = '/post/{id}/upload-slip'
   */
  postController.uploadPaymentSlip
);

// ดึงโพสต์ของเจ้าของ
//เปลี่ยนpath
router.get(
  "/ownerId/:id",
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'ดึงโพสต์ทั้งหมดของเจ้าของ'
   * #swagger.path = '/post/ownerId/{id}'
   */
  postController.getPostByOwner
);

// ดึงโพสต์ตาม id
//เปลี่ยนpath
router.get(
  "/post/:id",
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'ดึงโพสต์ตาม ID'
   * #swagger.path = '/post/post/{id}'
   */
  postController.getPostById
);

// อัปเดตโพสต์
router.put(
  "/:id",
  authJwt.verifyToken,
  uploads,
  uploadsToFirebase,
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'อัปเดตโพสต์'
   * #swagger.path = '/post/{id}'
   */
  postController.updatePost
);

// ลบโพสต์
//เปลี่ยนpath
router.delete(
  "/delete/:id",
  authJwt.verifyToken,
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'ลบโพสต์โดยเจ้าของ'
   * #swagger.path = '/post/delete/{id}'
   */
  postController.deletePostByOwner
);

// ดูผู้ที่สนใจโพสต์
router.get(
  "/:postId/interested-users",
  authJwt.verifyToken,
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'ดูรายชื่อผู้ที่สนใจโพสต์'
   * #swagger.path = '/post/{postId}/interested-users'
   */
  postController.getInterestedUsers
);

// ปิดการขายและแจ้งเตือน
router.patch(
  "/:postId/close",
  authJwt.verifyToken,
  /**
   * #swagger.tags = ['Post']
   * #swagger.summary = 'ปิดโพสต์และแจ้งเตือน'
   * #swagger.path = '/post/{postId}/close'
   */
  postController.closePostAndNotify
);

// ให้คะแนนผู้ขาย
router.post(
  "/:postId/rate",
  authJwt.verifyToken,
  /** 
   * #swagger.tags = ['Post']
   * #swagger.summary = 'ให้คะแนนผู้ขาย'
   * #swagger.path = '/post/{postId}/rate'
   */
  postController.rateSeller
);

router.get("/", postController.getPostsByType);


module.exports = router;
