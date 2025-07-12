import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import AdminService from "../../services/admin.service";
import Swal from "sweetalert2";

const statusLabels = {
  normal: { label: "ปกติ", class: "bg-green-100 text-green-800" },
  Banned: { label: "ถูกแบน", class: "bg-red-100 text-red-800" },
  outof: { label: "พ้นสภาพ", class: "bg-yellow-100 text-yellow-800" },
};

const ManageStatuses = () => {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await AdminService.getAllUsers(cookies.token);
      setUsers(res.data);
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
        await AdminService.updateUserStatus({ userId, newStatus }, cookies.token);
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

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14">
      <h2 className="text-3xl font-bold mb-6">จัดการสถานะผู้ใช้งานระบบ</h2>

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
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  ไม่พบผู้ใช้งาน
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const statusKey = user.userStatus || "normal";
                const statusInfo = statusLabels[statusKey];

                return (
                  <tr key={user._id} className="hover:bg-base-100">
                    <td className="px-4 py-3">{user.displayName || "-"}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="w-40 px-3 py-2 text-sm text-white bg-blue-500 rounded-md shadow-sm text-center appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                        value={statusKey}
                        onChange={(e) =>
                          handleStatusChange(user._id, e.target.value, user.displayName || user.email)
                        }
                      >
                        <option value="normal">ปกติ</option>
                        <option value="Banned">ถูกแบน</option>
                        <option value="outof">พ้นสภาพ</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStatuses;
