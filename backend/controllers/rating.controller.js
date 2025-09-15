const Rating = require('../models/rating.model');
const mongoose = require('mongoose');

// ดูประวัติคะแนนของผู้ขาย
exports.getSellerRatings = async (req, res) => {
  try {
    const { sellerId } = req.params;
    //ดึง page และ limit มาตากquery (ถ้าไม่มีจะใช้ค่าเริ่มต้น)
    const { page = 1, limit = 10 } = req.query;
    const userId = req.userId; 

    const ratings = await Rating.find({ seller: sellerId })
      .populate('post', 'productName price images')
      .populate('rater', 'displayName photoURL')
      .sort({ createdAt: -1 })
      //จำกัดจำนวนผลลัพธ์ต่อหน้า ตามค่า limit (บังคับเป็นตตัวเลข)
      .limit(limit * 1)
      //เช่นเรามีเรตติ้ง 100 อัน และ limit = 10
      //หน้าแรกเราจะแสดงแค่1–10 หน้า2แสดงตั้งแต่ 11-20
      //แต่ถ้าเราไม่ใส่ทุกครั้งที่เรียก API ถึงแม้จะเปลี่ยนหน้า มันก็จะดึง 10 อันแรกซ้ำๆ ตลอด
      .skip((page - 1) * limit);

    const totalRatings = await Rating.countDocuments({ seller: sellerId });
    const existingRating = await Rating.findOne({ seller: sellerId, rater: userId });
    // คำนวณสถิติ
    //Aggregation = การคำนวณสถิติ/รวมข้อมูลจากหลาย document
    const ratingStats = await Rating.aggregate([
      //WHERE seller = sellerId ใน SQL
      //ประมาณว่าเช็คก่อนว่า sellerId คือของคนขายคนไหนในDb
      { $match: { seller: new mongoose.Types.ObjectId(sellerId) } },
      {
        //วม document หลายตัวเป็นก้อนเดียวแต่ต้องidไม่เป็นnull
        $group: {
          _id: null,
          //(5+4+3)/3 =4
          averageRating: { $avg: "$rating" },
          //นับว่ามีกี่คนให้คะแนนผู้ขายคนนี้ บวก 1 ต่อ document 
          //รีวิว	    คำนวณ $sum:1	ผลรวมสะสม
          //1	      //0 + 1	        //1
          totalRatings: { $sum: 1 },
          // เอาคะแนนของทุกรีวิวมาใส่ array เช่น [5,4,3,5,2]
          // ใช้ต่อในการคำนวณ distribution ของดาว 1-5
          ratings: { $push: "$rating" }
        }
      }
    ]);
    //ถ้า seller ยังไม่มีรีวิวเลย → ratingStats = []  แต่ถถ้ามีรีวิวแล้วจะอันข้างบนว่ามีค่าไรบ้างใน averageRating totalRatings ratings
    const stats = ratingStats[0] || { averageRating: 0, totalRatings: 0, ratings: [] };

    return res.json({
      success: true,
      data: {
        ratings,
        alreadyRated: !!existingRating,
        stats: {
          //ใช้ Math.round(avgr *10)/10 ปัดเลขทศนิยม 1 ตำแหน่ง
          averageRating: Math.round(stats.averageRating * 10) / 10,
          //(= จำนวนคนให้คะแนน)
          totalRatings: stats.totalRatings,
          distribution: {
            5: stats.ratings.filter(r => r === 5).length, //เอาแค่คนให้คะแนน5 ว่ามีกี่คน เช่น[5,4,3,5,2] =2คน
            4: stats.ratings.filter(r => r === 4).length,
            3: stats.ratings.filter(r => r === 3).length,
            2: stats.ratings.filter(r => r === 2).length,
            1: stats.ratings.filter(r => r === 1).length,
          }
        },
        pagination: {
          //ใช้บอก ว่าตอนนี้ผู้ใช้กำลังอยู่หน้าที่เท่าไหร่
          currentPage: parseInt(page),
          //totalRatings = 25, limit = 10
          //25 / 10 = 2.5 ใช้ ceil ปัด 3 หน้า
          totalPages: Math.ceil(totalRatings / limit),
          //จำนวนรีวิวทั้งหมดของ seller
          totalItems: totalRatings,
          //page = 2, limit = 10, totalRatings = 25
          //2*10 = 20 < 25 เช็คว่า hasNext = true
            //page = 3  3*10 = 30 >= 25 เช็คว่า hasNext = false
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