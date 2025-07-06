const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');

// ดูประวัติคะแนนของผู้ขาย
router.get('/seller/:sellerId', ratingController.getSellerRatings);

module.exports = router;