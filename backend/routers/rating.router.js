const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');

// ดูประวัติคะแนนของผู้ขาย
router.get('/seller/:sellerId',
  /**
   * #swagger.tags = ['Rating']
   * #swagger.summary = 'ดึงประวัติคะแนนของผู้ขาย'
   * #swagger.path = '/rating/seller/{sellerId}'
   */
  ratingController.getSellerRatings
);

module.exports = router;