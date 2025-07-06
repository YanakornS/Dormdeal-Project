const Rating = require('../models/rating.model');
const mongoose = require('mongoose');

// ดูประวัติคะแนนของผู้ขาย
exports.getSellerRatings = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const ratings = await Rating.find({ seller: sellerId })
      .populate('post', 'productName price images')
      .populate('rater', 'displayName photoURL')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalRatings = await Rating.countDocuments({ seller: sellerId });
    
    // คำนวณสถิติ
    const ratingStats = await Rating.aggregate([
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
          ratings: { $push: "$rating" }
        }
      }
    ]);

    const stats = ratingStats[0] || { averageRating: 0, totalRatings: 0, ratings: [] };

    return res.json({
      success: true,
      data: {
        ratings,
        stats: {
          averageRating: Math.round(stats.averageRating * 10) / 10,
          totalRatings: stats.totalRatings,
          distribution: {
            5: stats.ratings.filter(r => r === 5).length,
            4: stats.ratings.filter(r => r === 4).length,
            3: stats.ratings.filter(r => r === 3).length,
            2: stats.ratings.filter(r => r === 2).length,
            1: stats.ratings.filter(r => r === 1).length,
          }
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalRatings / limit),
          totalItems: totalRatings,
          hasNext: page * limit < totalRatings
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "เกิดข้อผิดพลาด กรุณาลองใหม่" 
    });
  }
};