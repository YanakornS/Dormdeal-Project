import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ScanQrCode } from "lucide-react";
import qrcode from "qrcode";
import generatePayload from "promptpay-qr";
import Swal from "sweetalert2";
import PostService from './../../services/postproduct.service';

const PaymentPage = () => {
  const { postId } = useParams();
  
  const navigate = useNavigate();

  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const promptpayId = "0929785675";
  const amount = 110.0;

  useEffect(() => {
    const generateQr = async () => {
      try {
        const payload = generatePayload(promptpayId, { amount });
        const url = await qrcode.toDataURL(payload);
        setQrCodeUrl(url);
      } catch (err) {
        console.error("QR Generate Error:", err);
      }
    };
    generateQr();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
      setFile(selectedFile);
    } else {
      setPreview(null);
      setFile(null);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "โปรดเลือกภาพสลิปโอนเงิน",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await PostService.uploadPaymentSlip(postId, file);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "อัปโหลดสลิปสำเร็จ",
          text: "กรุณารอเจ้าหน้าที่ตรวจสอบการชำระเงิน",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถอัปโหลดสลิปได้ โปรดลองใหม่อีกครั้ง",
        });
      }
    } catch (error) {
        console.error("Upload Error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "โปรดลองใหม่อีกครั้ง",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-base-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-base rounded-xl p-6 space-y-8">
          {/* Header */}
          <div className="text-center">
            <ScanQrCode size={40} className="mx-auto mb-2" />
            <h1 className="text-2xl md:text-3xl font-semibold">Scan QR code</h1>
            <p className="text-sm text-zinc-400 mt-1">
              กรุณาแสกน QR code เพื่อชำระเงินผ่าน Mobile-Banking
            </p>
          </div>

          {/* QR Image */}
          <div className="flex justify-center">
            {qrCodeUrl ? (
              <img
                src={qrCodeUrl}
                alt="PromptPay QR Code"
                className="w-48 h-48 md:w-60 md:h-60 object-cover border rounded-2xl shadow-lg"
              />
            ) : (
              <p className="text-center text-gray-500">กำลังสร้าง QR Code...</p>
            )}
          </div>

          {/* Divider + Text */}
          <div className="flex items-center justify-center">
            <div className="flex-grow max-w-[100px] h-px bg-gray-400" />
            <span className="px-4 text-base-700 text-sm text-center whitespace-nowrap">
              อัปโหลดภาพหลักฐานยืนยันการโอนเงิน
            </span>
            <div className="flex-grow max-w-[100px] h-px bg-gray-400" />
          </div>

          {/* File Upload */}
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-md w-full max-w-sm"
            />

            {/* Preview */}
            {preview && (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-48 h-48 md:w-60 md:h-60 object-contain border rounded-2xl shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              className="btn btn-outline btn-error w-full sm:w-48"
              onClick={handleCancel}
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              className="btn btn-primary w-full sm:w-48"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "กำลังส่ง..." : "ยืนยันการชำระเงิน"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
