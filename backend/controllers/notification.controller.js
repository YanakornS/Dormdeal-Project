const Notification = require('../models/notification.model');

// ดูแจ้งเตือน
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ recipient: userId })
      .populate('post', 'productName price images')
      .populate('seller', 'displayName photoURL')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalNotifications = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({ 
      recipient: userId, 
      isRead: false 
    });

    return res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalNotifications / limit),
          totalItems: totalNotifications,
          hasNext: page * limit < totalNotifications
        },
        unreadCount
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาด กรุณาลองใหม่" 
    });
  }
};

// อ่านแจ้งเตือน
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: "ไม่พบแจ้งเตือนนี้" 
      });
    }

    return res.json({
      success: true,
      message: "อ่านแจ้งเตือนแล้ว",
      data: notification
    });
  } catch (error) {
    console.error('Error in markNotificationAsRead:', error);
    return res.status(500).json({ 
      success: false, 
      message: "เกิดข้อผิดพลาด กรุณาลองใหม่" 
    });
  }
};

// อ่านแจ้งเตือนทั้งหมดของ user
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true }
    );

    return res.json({
      success: true,
      message: "อ่านแจ้งเตือนทั้งหมดแล้ว"
    });
  } catch (error) {
    console.error("Error in markAllAsRead:", error);
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด กรุณาลองใหม่"
    });
  }
};
