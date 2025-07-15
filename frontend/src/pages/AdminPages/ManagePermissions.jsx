import React, { useEffect, useState } from "react";
import AdminService from "../../services/admin.service";
import { useCookies } from "react-cookie";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ManagePermissions = () => {
  const [users, setUsers] = useState([]);
  const [cookies] = useCookies(["token"]);

  const [filterRole, setFilterRole] = useState("ทั้งหมด");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const filteredUsers =
    filterRole === "ทั้งหมด"
      ? users
      : users.filter((user) => user.role === filterRole);

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
  }, [filterRole]);

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

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="section-container sm:mt-7 mt-6 px-6 py-14">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">สิทธิ์ของผู้ใช้งานระบบ</h2>

        <select
          data-test="filter-role-select"
          className="border rounded px-8 py-2 text-base"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="admin">Admin</option>
          <option value="mod">Mod</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-fixed w-full min-w-[600px]">
          <thead className="bg-base-200 text-base-content">
            <tr>
              <th className="px-4 py-3 text-left w-[35%]">ชื่อผู้ใช้</th>
              <th className="px-4 py-3 text-left w-[35%]">อีเมล</th>
              <th className="px-4 py-3 text-center w-[30%]">สิทธิ์ปัจจุบัน</th>
            </tr>
          </thead>
          <tbody data-test="user-list">
            {currentUsers.length === 0 ? (
              <tr data-test="no-users-row">
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  ไม่พบผู้ใช้งานในระบบ
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  data-test={`user-row-${user._id}`}
                  className="hover:bg-base-100"
                >
                  <td
                    data-test={`user-name-${user._id}`}
                    className="px-4 py-3 truncate"
                  >
                    {user.displayName || "-"}
                  </td>
                  <td
                    data-test={`user-email-${user._id}`}
                    className="px-4 py-3 truncate"
                  >
                    {user.email}
                  </td>
                  <td
                    data-test={`user-role-${user._id}`}
                    className="px-4 py-3 text-center capitalize"
                  >
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

      {totalPages > 1 && (
        <div
          data-test="pagination"
          className="flex justify-center items-center gap-4 mt-6"
        >
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

export default ManagePermissions;
