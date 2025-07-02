const Report = require("../models/report.model");

//เเก้โดย Oxe
// Create new report
exports.createReport = async (req, res) => {
  try {
    const { postId, reporter, reasons, details } = req.body;

    if (!postId || !reporter || !reasons || !details || reasons.length === 0) {
      return res
        .status(400)
        .json({ message: "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนส่งรายงาน" });
    }

    const report = new Report({
      postId,
      reporter,
      reasons,
      details,
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "เกิดข้อผิดพลาดระหว่างการสร้างรายงาน กรุณาลองใหม่อีกครั้ง",
    });
  }
};

// //Get all reports
// exports.getAllReports = async (req, res) => {
//   try {
//     const reports = await Report.find()
//       .populate("reporter", ["displayName"])
//     res.json(reports);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch reports." });
//   }
// };

//Get all reports :: EDIT BY Kays
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "displayName")

      .populate({
        path: "postId",
        select: "productName category owner",

        populate: [
          {
            path: "category",
            select: "name",
          },
          {
            path: "owner",
            select: "displayName",
          },
        ],
      });

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message:
        "ไม่สามารถดึงข้อมูลรายงานได้ในขณะนี้ กรุณาลองใหม่อีกครั้งภายหลัง",
    });
  }
};

// Get report by ID
exports.getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id).populate("reporter", [
      "displayName",
    ]);
    if (!report) {
      return res.status(404).json({ message: "ไม่พบรายงานที่คุณต้องการ" });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({
      message:
        "เกิดข้อผิดพลาดระหว่างการดึงรายละเอียดรายงาน กรุณาลองใหม่อีกครั้ง",
    });
  }
};

// Delete report by ID
exports.deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ message: "ไม่พบรายงานที่ต้องการลบ" });
    }

    await Report.findByIdAndDelete(id);

    res.status(200).json({ message: "ลบรายงานเรียบร้อยแล้ว" });
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดระหว่างการลบรายงาน กรุณาลองใหม่อีกครั้ง",
    });
  }
};
