const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authJwt = require("../middlewares/auth.middleware");

// ดูแจ้งเตือน
router.get('/', authJwt.verifyToken, notificationController.getNotifications);

// อ่านแจ้งเตือน
router.put('/:notificationId/read', authJwt.verifyToken, notificationController.markNotificationAsRead);

module.exports = router;