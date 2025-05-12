import React, { useContext, useState } from "react";
import { MdOutlineReport } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import ReportService from "../../services/report.service";
import { AuthContext } from "../../context/AuthContext";

const ModalReport = ({ postId }) => {
  const { getUser } = useContext(AuthContext);
  const user = getUser();

  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleCheckboxChange = (reason) => {
    setSelectedReason(selectedReason === reason ? "" : reason);
  };

  const handleSubmit = async () => {
    if (!selectedReason || !otherReason.trim()) {
      Swal.fire("กรุณากรอกข้อมูลให้ครบ", "เลือกเหตุผลและกรอกรายละเอียด", "warning");
      return;
    }

    if (!user || !user._id) {
      Swal.fire("คุณยังไม่ได้เข้าสู่ระบบ", "กรุณาเข้าสู่ระบบก่อนรายงาน", "error");
      return;
    }

    const payload = {
      postId,
      reporter: user._id,
      reasons: [selectedReason],
      details: otherReason.trim(),
    };

    console.log("🚀 ส่งข้อมูล payload:", payload);

    try {
      await ReportService.createReport(payload);
      Swal.fire("ส่งรายงานสำเร็จ", "ขอบคุณที่ช่วยแจ้งปัญหา", "success");
      setSelectedReason("");
      setOtherReason("");
      document.getElementById("report_modal").close();
    } catch (error) {
      console.error("Report error:", error);
      Swal.fire("เกิดข้อผิดพลาด", error.response?.data?.message || "ไม่สามารถส่งรายงานได้", "error");
    }
  };

  return (
    <>
      <button
        onClick={() => document.getElementById("report_modal").showModal()}
        className="flex items-center bg-vivid text-white px-4 py-2 rounded-lg border border-blue-500 hover:bg-blue-200"
      >
        <MdOutlineReport size={20} className="mr-2" />
        รายงานโพสต์
      </button>

      <dialog id="report_modal" className="modal">
        <div className="modal-box w-full max-w-lg p-6">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <h3 className="font-bold text-lg mb-6">แจ้งปัญหาเกี่ยวกับโพสต์ขายสินค้า</h3>

          <div className="space-y-4">
            {[
              "ข้อมูลสินค้าไม่ตรงตามที่ระบุ",
              "โพสต์นี้น่าจะเป็นสแปมหรือโฆษณา",
              "โพสต์นี้เป็นสินค้าผิดกฎหมาย",
              "อื่นๆ",
            ].map((reason) => (
              <label key={reason} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedReason === reason}
                  onChange={() => handleCheckboxChange(reason)}
                  className="w-5 h-5 border-gray-300 rounded-md appearance-none checked:bg-neutral checked:border-transparent focus:ring-2 focus:ring-neutral-500"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium">
              กรอกเหตุผลที่แจ้งรายงาน (ระบุให้ชัดเจน) <span className="text-red-600">*</span>
            </label>
            <textarea
              className="textarea rounded-2xl textarea-bordered w-full mt-2 h-24"
              placeholder="กรอกรายละเอียดปัญหาที่ต้องการแจ้ง..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              className="btn bg-vivid text-white border-blue-500 hover:bg-blue-200 flex items-center px-6 py-2 rounded-xl"
              type="button"
            >
              <FaCheckCircle className="mr-2 text-white" size={18} />
              ส่งรายงาน
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalReport;
