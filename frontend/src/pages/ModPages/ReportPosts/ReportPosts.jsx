import React, { useEffect, useState } from "react";
import ReportService from "../../../services/report.service";
import ModalReportDetail from "../ModalReportDetail/ModalReportDetail";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";



const ReportPosts = () => {
  const [reports, setReports] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [filterReason, setFilterReason] = useState("ทั้งหมด");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

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

  // pagination
  const filteredReports = reports.filter((report) =>
    filterReason === "ทั้งหมด" ? true : report.reasons?.includes(filterReason)
  );

  // pagination
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  // pagination
  const currentReports = filteredReports.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredReports.length / postsPerPage);

  return (
  <div className="section-container sm:mt-7 mt-6 px-6 py-14 flex flex-col h-full">
    {/* หัวข้อและตัวเลือก */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-3xl font-bold">แจ้งรายงานปัญหา</h2>

      <select
        className="border border-gray-300 rounded px-3 py-2"
        value={filterReason}
        onChange={(e) => setFilterReason(e.target.value)}
      >
        <option value="ทั้งหมด">ทั้งหมด</option>
        <option value="ข้อมูลสินค้าไม่ตรงตามที่ระบุ">
          ข้อมูลสินค้าไม่ตรงตามที่ระบุ
        </option>
        <option value="โพสต์นี้น่าจะเป็นสแปมหรือโฆษณา">
          โพสต์นี้น่าจะเป็นสแปมหรือโฆษณา
        </option>
        <option value="โพสต์นี้เป็นสินค้าผิดกฎหมาย">
          โพสต์นี้เป็นสินค้าผิดกฎหมาย
        </option>
        <option value="อื่นๆ">อื่นๆ</option>
      </select>
    </div>

    {/* ตัวตาราง (flex-grow จะยืดเต็ม เพื่อให้ pagination อยู่ด้านล่าง) */}
    <div className="flex-grow overflow-x-auto mb-4">
      <table className="table table-fixed w-full">
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th className="px-4 py-3 text-left w-[25%]">
              ชื่อโพสต์
            </th>
            <th className="px-4 py-3 text-left w-[35%]">
              หัวข้อรายงาน
            </th>
            <th className="px-4 py-3 text-left w-[25%]">
              ชื่อผู้รายงาน
            </th>
            <th className="px-4 py-3 text-left w-[15%]">
              ดูรายงาน
            </th>
          </tr>
        </thead>
        <tbody>
          {currentReports.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-500">
                ไม่มีรายงาน
              </td>
            </tr>
          ) : (
            currentReports.map((report) => (
              <tr key={report._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-left truncate">
                   {report.postId?.productName ||
                     "ไม่ทราบชื่อโพสต์"}
                </td>
                <td className="px-4 py-3 text-left truncate">
                   {report.reasons?.join(", ")}
                </td>
                <td className="px-4 py-3 text-left truncate">
                   {report.reporter?.displayName ||
                     "ไม่ทราบชื่อผู้รายงาน"}
                </td>
                <td className="px-4 py-3 text-center">
                   <button
                     onClick={() => setSelectedReport(report)}
                     className="btn-checkpost bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                   >
                     ดูรายงานปัญหา
                   </button>
                 </td>
                 {selectedReport &&
                   selectedReport._id === report._id && (
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

    {/* pagination จะถูกยึดอยู่ด้านล่าง */}
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 disabled:opacity-50 rounded"
      >
        <MdOutlineArrowBackIos />
      </button>
      <span>
        หน้า {currentPage} / {totalPages}
      </span>
      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(totalPages, prev + 1)
          )
        }
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 disabled:opacity-50 rounded"
      >
        <MdArrowForwardIos />
      </button>
    </div>
  </div>
);


};

export default ReportPosts;
