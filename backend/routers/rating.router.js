const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.comtroller');

// ดูประวัติคะแนนของผู้ขาย
router.get('/seller/:sellerId', ratingController.getSellerRatings);

module.exports = router;