
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Post"
  },
  reporter : {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  reasons: [
    {
      type: String,
      enum: [
        "ข้อมูลสินค้าไม่ตรงตามที่ระบุ",
        "โพสต์นี้น่าจะเป็นสแปมหรือโฆษณา",
        "โพสต์นี้เป็นสินค้าผิดกฎหมาย",
        "อื่นๆ"
      ]
    }
  ],
  details: { type: String },
},{
    timestamps: true
}
);

module.exports = mongoose.model("Report", ReportSchema);
