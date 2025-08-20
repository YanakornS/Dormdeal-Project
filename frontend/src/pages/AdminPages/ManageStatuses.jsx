import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import AdminService from "../../services/admin.service";
import Swal from "sweetalert2";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const statusLabels = {
  normal: { label: "ปกติ", class: "bg-green-100 text-green-800" },
  Banned: { label: "ถูกแบน", class: "bg-red-100 text-red-800" },
  outof: { label: "พ้นสภาพ", class: "bg-yellow-100 text-yellow-800" },
};

const ManageStatuses = () => {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["token"]);
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 10;

  const filteredUsers =
    filterStatus === "ทั้งหมด"
      ? users
      : users.filter((user) => (user.userStatus || "normal") === filterStatus);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const fetchUsers = async () => {
    try {
      const res = await AdminService.getAllUsers(cookies.token);

      const sortedUsers = res.data.sort((a, b) => {
        const aIsNpru = a.email?.endsWith("@webmail.npru.ac.th") ? 0 : 1;
        const bIsNpru = b.email?.endsWith("@webmail.npru.ac.th") ? 0 : 1;
        if (aIsNpru !== bIsNpru) return aIsNpru - bIsNpru;

        return (a.displayName || "").localeCompare(b.displayName || "");
      });

      setUsers(sortedUsers);
    } catch (err) {
      console.error("ดึงข้อมูลผู้ใช้ล้มเหลว:", err);
    }
  };

  const handleStatusChange = async (userId, newStatus, displayName) => {
    try {
      const confirm = await Swal.fire({
        title: "คุณแน่ใจหรือไม่?",
        html: `คุณต้องการเปลี่ยนสถานะของ <strong>${displayName}</strong> เป็น <strong>${statusLabels[newStatus].label}</strong> ใช่หรือไม่?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#d33",
      });

      if (confirm.isConfirmed) {
        await AdminService.updateUserStatus(
          { userId, newStatus },
          cookies.token
        );
        await fetchUsers();
        Swal.fire({
          icon: "success",
          title: "เปลี่ยนสถานะสำเร็จ",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err?.response?.data?.message || "ไม่สามารถเปลี่ยนสถานะได้",
      });
    }
  };

  const showStatusChangeAlert = (user) => {
    const statusKey = user.userStatus || "normal";
    Swal.fire({
      title: `แก้ไขสถานะของ ${user.displayName || user.email}`,
      input: "select",
      inputOptions: {
        normal: "ปกติ",
        Banned: "ถูกแบน",
        outof: "พ้นสภาพ",
      },
      inputValue: statusKey,
      showCancelButton: true,
      confirmButtonText: "อัปเดตสถานะ",
      cancelButtonText: "ยกเลิก",
      inputValidator: (value) => {
        if (!value) return "กรุณาเลือกสถานะ";
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value !== statusKey) {
        handleStatusChange(
          user._id,
          result.value,
          user.displayName || user.email
        );
      }
    });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">จัดการสถานะผู้ใช้งานระบบ</h2>

        <select
          data-test="filter-status-select"
          className="border rounded px-3 py-2 text-base"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="normal">ปกติ</option>
          <option value="Banned">ถูกแบน</option>
          <option value="outof">พ้นสภาพ</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-fixed w-full min-w-[700px]">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th className="px-4 py-3 text-left w-[25%]">ชื่อผู้ใช้</th>
              <th className="px-4 py-3 text-left w-[30%]">อีเมล</th>
              <th className="px-4 py-3 text-left w-[20%]">สถานะบัญชี</th>
              <th className="px-4 py-3 text-left w-[25%]">จัดการสถานะบัญชี</th>
            </tr>
          </thead>
          <tbody data-test="user-list">
            {currentUsers.length === 0 ? (
              <tr data-test="no-users-row">
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  ไม่พบผู้ใช้งาน
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => {
                const statusKey = user.userStatus || "normal";
                const statusInfo = statusLabels[statusKey];

                return (
                  <tr
                    key={user._id}
                    data-test={`user-row-${user._id}`}
                    className="hover:bg-base-100"
                  >
                    <td
                      data-test={`user-name-${user._id}`}
                      className="px-4 py-3"
                    >
                      {user.displayName || "-"}
                    </td>
                    <td
                      data-test={`user-email-${user._id}`}
                      className="px-4 py-3"
                    >
                      {user.email}
                    </td>
                    <td
                      data-test={`user-status-${user._id}`}
                      className="px-4 py-3"
                    >
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusInfo.class}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        data-test={`edit-status-btn-${user._id}`}
                        onClick={() => showStatusChangeAlert(user)}
                        className="btn rounded-xl border-blue-500 text-base text-blue-500 font-medium px-4 py-2 "
                      >
                        แก้ไขสถานะบัญชี
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            data-test="pagination-prev"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            <IoChevronBack size={20} />
          </button>
          <span data-test="pagination-current" className="text-base">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            data-test="pagination-next"
            onClick={handleNext}
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

export default ManageStatuses;
