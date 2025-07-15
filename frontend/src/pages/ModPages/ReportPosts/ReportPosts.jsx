import React, { useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import ReportService from "../../../services/report.service";
import ModalReportDetail from "../ModalReportDetail/ModalReportDetail";

const ReportPosts = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterReason, setFilterReason] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);

  const reportsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await ReportService.getAllReports();
        setReports(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReports();
  }, []);

  const handleReportHandled = (reportId) => {
    setReports((prev) => prev.filter((r) => r._id !== reportId));
    setSelectedReport(null);
  };

  const filteredReports = reports.filter((report) =>
    filterReason === "ทั้งหมด" ? true : report.reasons?.includes(filterReason)
  );

  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = filteredReports.slice(
    startIndex,
    startIndex + reportsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    // ถ้ากรองแล้วมีข้อมูลหน้าน้อยกว่าหน้าปัจจุบัน ให้กลับไปหน้าแรก
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filterReason, totalPages]);

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">แจ้งรายงานปัญหา</h2>

        <select
          data-test="report-filter-select"
          className="border rounded px-3 py-2"
          value={filterReason}
          onChange={(e) => setFilterReason(e.target.value)}
        >
          <option className="text-black" value="ทั้งหมด">
            ทั้งหมด
          </option>
          <option className="text-black" value="ข้อมูลสินค้าไม่ตรงตามที่ระบุ">
            ข้อมูลสินค้าไม่ตรงตามที่ระบุ
          </option>
          <option className="text-black" value="โพสต์นี้น่าจะเป็นสแปมหรือโฆษณา">
            โพสต์นี้น่าจะเป็นสแปมหรือโฆษณา
          </option>
          <option className="text-black" value="โพสต์นี้เป็นสินค้าผิดกฎหมาย">
            โพสต์นี้เป็นสินค้าผิดกฎหมาย
          </option>
          <option className="text-black" value="อื่นๆ">
            อื่นๆ
          </option>
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
            {currentReports.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  data-test="report-no-data"
                  className="text-center py-6 text-gray-500"
                >
                  ไม่มีรายงาน
                </td>
              </tr>
            ) : (
              currentReports.map((report) => (
                <tr key={report._id}>
                  <td className="px-4 py-3 truncate">
                    {report.postId?.productName || "ไม่ทราบชื่อโพสต์"}
                  </td>
                  <td className="px-4 py-3 truncate">
                    {report.reasons?.join(", ")}
                  </td>
                  <td className="px-4 py-3 truncate">
                    {report.reporter?.displayName || "ไม่ทราบชื่อผู้รายงาน"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      data-test={`report-view-${report._id}`}
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            data-test="report-pagination-prev"
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            <IoChevronBack size={20} />
          </button>
          <span className="text-base" data-test="report-pagination-info">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            data-test="report-pagination-next"
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            <IoChevronForward size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReportPosts;
