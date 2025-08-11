const axios = require("axios");
const FormData = require("form-data");
const PostModel = require("../models/post.model");

const verifySlipWithEasySlip = async (req, res, next) => {
  try {
    const file = req.file;
    
    const requiredAmount = parseInt(process.env.REQUIREDAMOUNT_PROMPTPAY_QR);
    const expectedNameENG  = process.env.EXPECTEDNAMEENG_PROMPTPAY_QR;

    if (!file) {
      return res.status(400).json({ message: "ไม่พบสลิปที่อัปโหลด" });
    }

    const form = new FormData();
    form.append("file", file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await axios.post(
      "https://developer.easyslip.com/api/v1/verify",
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.EASYSLIP_API_KEY}`,
        },
      }
    );

    const data = response?.data?.data;
    const slipTransactionRef = data.transRef;
    
    if (response.status !== 200) {
      return res.status(400).json({ message: "สลิปไม่ถูกต้อง กรุณาลองใหม่" });
    }

    const slipAmount = data?.amount?.amount;
    const actualName = data?.receiver?.account?.name?.en;

    if (slipAmount !== requiredAmount) {
      return res.status(400).json({ message: "ยอดเงินในสลิปไม่ตรงกับยอดที่ต้องชำระ" });
    }
    
    if (actualName !== expectedNameENG) {
      return res.status(400).json({ message: "บัญชีผู้รับเงินไม่ถูกต้อง" });
    }

    if (slipTransactionRef) {
      const existsByRef = await PostModel.findOne({ slipTransactionRef });
      if (existsByRef) {
        return res.status(409).json({ message: "สลิปนี้ถูกใช้งานเรียบร้อยแล้ว" });
      }
    }

    // using for controller
    req.slipMeta = { transactionRef: slipTransactionRef };

    next();
  } catch (error) {
    console.error("EasySlip verify error:", error.response?.data || error.message);
    res.status(500).json({ message: "ตรวจสอบสลิปไม่สำเร็จ กรุณาลองใหม่" });
  }
};

module.exports = verifySlipWithEasySlip;
