import React, { useEffect, useState } from "react";
import AdminService from "../../services/admin.service";
import { useCookies } from "react-cookie";

const ManagePermissions = () => {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await AdminService.getAllUsers(cookies.token);
      const sortedUsers = res.data.sort((a, b) => {
        const order = { admin: 0, mod: 1, user: 2 };
        return order[a.role] - order[b.role];
      });
      setUsers(sortedUsers);
    } catch (err) {
      console.error("ไม่สามารถดึงผู้ใช้ได้:", err.message);
    }
  };

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14">
      <h2 className="text-3xl font-bold mb-6">สิทธิ์ของผู้ใช้งานระบบ</h2>

      <div className="overflow-x-auto">
        <table className="table table-fixed w-full min-w-[600px]">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th className="px-4 py-3 text-left w-[35%]">ชื่อผู้ใช้</th>
              <th className="px-4 py-3 text-left w-[35%]">อีเมล</th>
              <th className="px-4 py-3 text-left w-[30%]">สิทธิ์ปัจจุบัน</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  ไม่พบผู้ใช้งานในระบบ
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-base-100">
                  <td className="px-4 py-3 truncate">{user.displayName || "-"}</td>
                  <td className="px-4 py-3 truncate">{user.email}</td>
                  <td className="px-4 py-3 capitalize">
                    <span
                      className={
                        (user.role === "admin"
                          ? "text-red-600 border border-red-600"
                          : user.role === "mod"
                          ? "text-yellow-600 border border-yellow-600"
                          : "text-blue-600 border border-blue-600") +
                        " rounded px-3 py-1 w-28 inline-block text-center font-medium"
                      }
                    >
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePermissions;
