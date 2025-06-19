import React, { useEffect, useState } from "react";
import ReportService from "../../../services/report.service";
import ModalReportDetail from "../ModalReportDetail/ModalReportDetail";

const ReportPosts = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterReason, setFilterReason] = useState("ทั้งหมด");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await ReportService.getAllReports();
        setReports(res.data);
      } catch {}
    };

    fetchReports();
  }, []);

  const handleReportHandled = (reportId) => {
    setReports((prev) => prev.filter((r) => r._id !== reportId));
    setSelectedReport(null);
  };

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">แจ้งรายงานปัญหา</h2>

        <select
          className="border rounded px-3 py-2"
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
        >
          
          <option className="text-black" value="ทั้งหมด">ทั้งหมด</option>
          <option className="text-black" value="ข้อมูลสินค้าไม่ตรงตามที่ระบุ">
            ข้อมูลสินค้าไม่ตรงตามที่ระบุ
          </option>
          <option className="text-black" value="โพสต์นี้น่าจะเป็นสแปมหรือโฆษณา">
            โพสต์นี้น่าจะเป็นสแปมหรือโฆษณา
          </option>
          <option className="text-black" value="โพสต์นี้เป็นสินค้าผิดกฎหมาย">
            โพสต์นี้เป็นสินค้าผิดกฎหมาย
          </option>
          <option className="text-black" value="อื่นๆ">อื่นๆ</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-fixed w-full">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th className="px-4 py-3 text-left w-[25%]">ชื่อโพสต์</th>
              <th className="px-4 py-3 text-left w-[35%]">หัวข้อรายงาน</th>
              <th className="px-4 py-3 text-left w-[25%]">ชื่อผู้รายงาน</th>
              <th className="px-4 py-3 text-left w-[15%]">ดูรายงาน</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  ไม่มีรายงาน
                </td>
              </tr>
            ) : (
              reports
                .filter((report) =>
                  filterReason === "ทั้งหมด"
                    ? true
                    : report.reasons?.includes(filterReason)
                )
                .map((report) => (
                  <tr key={report._id} className="">
                    <td className="px-4 py-3 text-left truncate">
                      {report.postId?.productName || "ไม่ทราบชื่อโพสต์"}
                    </td>
                    <td className="px-4 py-3 text-left truncate">
                      {report.reasons?.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-left truncate">
                      {report.reporter?.displayName || "ไม่ทราบชื่อผู้รายงาน"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="btn-checkpost bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                      >
                        ดูรายงานปัญหา
                      </button>
                    </td>
                    {selectedReport && selectedReport._id === report._id && (
                      <ModalReportDetail
                        report={selectedReport}
                        onClose={() => setSelectedReport(null)}
                        onReportHandled={handleReportHandled}
                      />
                    )}
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportPosts;
