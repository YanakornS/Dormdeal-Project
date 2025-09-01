const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authJwt = require("../middlewares/auth.middleware");

// ดูแจ้งเตือน
router.get("/",
  /**
   * #swagger.tags = ['Notification']
   * #swagger.summary = 'ดึงรายการแจ้งเตือนของผู้ใช้'
   * #swagger.path = '/notification'
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.parameters['page'] = { in: 'query', description: 'หน้าที่ต้องการ', type: 'integer', default: 1 }
   * #swagger.parameters['limit'] = { in: 'query', description: 'จำนวนแจ้งเตือนต่อหน้า', type: 'integer', default: 20 }
   */
  authJwt.verifyToken,
  notificationController.getNotifications
);

// อ่านแจ้งเตือน
router.put("/:notificationId/read",
  /**
   * #swagger.tags = ['Notification']
   * #swagger.summary = 'ทำเครื่องหมายว่าแจ้งเตือนนี้อ่านแล้ว'
   * #swagger.path = '/notification/{notificationId}/read'
   * #swagger.security = [{ "bearerAuth": [] }]
   * #swagger.parameters['notificationId'] = { in: 'path', description: 'รหัสแจ้งเตือน', required: true }
   */
  authJwt.verifyToken,
  notificationController.markNotificationAsRead
);

// read all
router.put("/read-all",
  authJwt.verifyToken,
  notificationController.markAllAsRead
);


module.exports = router;