import Swal from "sweetalert2";
import { MdOutlineReport } from "react-icons/md";
import { FaTrashAlt, FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";
import PostService from "../../../services/mod.service";
import ReportService from "../../../services/report.service";

const ModalReportDetail = ({ report, onClose, onReportHandled }) => {
  const { postId, reporter, reasons, details } = report;

  const handleAction = async (action) => {
    try {
      if (!postId?._id) {
        throw new Error("ไม่พบ ID ของโพสต์");
      }

      if (action === "delete") {
        const result = await Swal.fire({
          title: "ยืนยันการลบโพสต์?",
          text: "หากลบแล้วจะไม่สามารถกู้คืนได้",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ลบเลย",
          cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
          await PostService.deletePostProductByMod(postId._id);
          await ReportService.deleteReport(report._id);
          Swal.fire("ลบโพสต์สำเร็จ", "", "success");
          onReportHandled(report._id);
        }
      } else if (action === "normal") {
        Swal.fire("จัดการสำเร็จ", "โพสต์นี้ถูกตั้งสถานะเป็นปกติ", "success");
        await ReportService.deleteReport(report._id);
        onReportHandled(report._id);

        onClose();
      } else if (action === "go_to_post") {
        window.open(`/postproductdetail/${postId._id}`, "_blank");
      }
    } catch (err) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err.message || "ไม่สามารถดำเนินการได้",
        "error"
      );
    }
  };

  return (
    <dialog id="report_detail_modal" className="modal modal-open">
      <div className="modal-box w-full max-w-2xl p-6 bg-base-100 border border-base-300 rounded-xl relative shadow-md">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
          data-test="modalreport-close-button"
        >
          ✕
        </button>

        <h3 className="font-bold text-xl mb-6 flex items-center text-primary">
          <MdOutlineReport className="mr-2" size={24} />
          รายละเอียดรายงานโพสต์
        </h3>

        {/* รายละเอียดโพสต์ */}
        <div className="p-4 border border-base-300 bg-base-100 rounded-lg mb-4 shadow-sm">
          <p className="mb-2">
            <strong>ผู้โพสต์:</strong>{" "}
            {postId?.owner?.displayName || "ไม่ทราบผู้ขาย"}
          </p>
          <p className="mb-2">
            <strong>ชื่อสินค้า:</strong> {postId?.productName || "ไม่ทราบชื่อ"}
          </p>
          <p className="mb-2">
            <strong>หมวดหมู่:</strong>{" "}
            {typeof postId?.category === "object"
              ? postId.category?.name
              : postId?.category || "-"}
          </p>
        </div>

        {/* รายละเอียดการรายงาน */}
        <div className="p-4 border border-base-300 bg-base-100 rounded-lg mb-4 shadow-sm">
          <p className="mb-2">
            <strong>ผู้รายงาน:</strong> {reporter?.displayName || "ไม่ทราบชื่อ"}
          </p>
          <p className="mb-2">
            <strong>เหตุผล:</strong> {reasons?.join(", ")}
          </p>
          <p>
            <strong>รายละเอียดเพิ่มเติม:</strong> {details || "-"}
          </p>
        </div>

        {/* ปุ่มแอคชัน */}
        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <button
            onClick={() => handleAction("delete")}
            data-test="modalreport-delete-button"
            className="btn bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl"
            type="button"
          >
            <FaTrashAlt className="mr-2" size={16} />
            ลบโพสต์
          </button>
          <button
            onClick={() => handleAction("normal")}
            data-test="modalreport-normal-button"
            className="btn bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl"
            type="button"
          >
            <FaCheckCircle className="mr-2" size={16} />
            โพสต์ปกติ
          </button>
          <button
            onClick={() => handleAction("go_to_post")}
            data-test="modalreport-goto-button"
            className="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl"
            type="button"
          >
            <FaExternalLinkAlt className="mr-2" size={16} />
            ไปยังโพสต์สินค้า
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalReportDetail;
