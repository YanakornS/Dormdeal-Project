const axios = require("axios");
const FormData = require("form-data");

const verifySlipWithEasySlip = async (req, res, next) => {
  try {
    const file = req.file;
    const requiredAmount = 110; 
    const expectedNameENG  = "MR. ANGKAN B";

    if (!file || !file.buffer) {
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

    console.log("SLIP", response.data);
    

    if (response.status !== 200) {
      return res.status(400).json({ message: "สลิปไม่ถูกต้อง กรุณาลองใหม่" });
    }

    const slipAmount = response.data.data.amount.amount;
    const actualName = response.data.data.receiver.account.name.en;

    if (slipAmount !== requiredAmount) {
      return res.status(400).json({ message: "ยอดเงินในสลิปไม่ตรงกับยอดที่ต้องชำระ" });
    }
    
    if (actualName !== expectedNameENG) {
      return res.status(400).json({ message: "บัญชีผู้รับเงินไม่ถูกต้อง" });
    }

    next();
  } catch (error) {
    console.error("EasySlip verify error:", error.response?.data || error.message);
    res.status(500).json({ message: "ตรวจสอบสลิปไม่สำเร็จ กรุณาลองใหม่" });
  }
};

module.exports = verifySlipWithEasySlip;
