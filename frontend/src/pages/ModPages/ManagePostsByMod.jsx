import { useEffect, useState } from "react";
import ModService from "../../services/mod.service";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { BsTrash3 } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ManagePostsByMod = () => {
  const [posts, setPosts] = useState([]);
  const [filterType, setFilterType] = useState("ทั้งหมด");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const filteredPosts =
    filterType === "ทั้งหมด"
      ? posts
      : posts.filter((post) => post.postType === filterType);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await ModService.getAllPostsByMod();

        response.data.forEach((post) => {
          console.log(`Post: ${post.productName} => ${post.postType}`);
        });
        setPosts(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผลิตภัณฑ์ :", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType]);

  const handleDeletePost = (id) => {
    Swal.fire({
      title: "ลบโพสต์",
      text: "คุณต้องการลบโพสต์นี้หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ModService.deletePostProductByMod(id);
          setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
          Swal.fire({
            title: "ลบโพสต์สำเร็จ",
            text: "โพสต์ถูกลบเรียบร้อยแล้ว",
            icon: "success",
          });
        } catch (error) {
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบโพสต์ได้",
            icon: "error",
          });
          console.error("ลบโพสต์ล้มเหลว:", error);
        }
      }
    });
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="section-container overflow-x-auto rounded-box border border-base-content/5 bg-base-100 py-14">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold"id="mod-manage-posts-title" >อนุมัติโพสต์ซื้อขาย</h2>
        <select
          className="border rounded px-4 py-2 text-base"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="WTS">WTS (ขาย)</option>
          <option value="WTB">WTB (ซื้อ)</option>
        </select>
      </div>

      <table className="table" data-test="post-table">
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th>ชื่อสินค้า</th>
            <th>ประเภทโพสต์</th>
            <th>ชื่อผู้ขาย</th>
            <th>หมวดหมู่สินค้า</th>
            <th>วันที่</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post._id} className="transition-all">
              <td className="px-4 py-3 text-left">{post.productName}</td>
              <td className="px-4 py-3 text-left">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    post.postType === "WTS"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {post.postType}
                </span>
              </td>
              <td className="px-4 py-3 text-left">
                {post.owner?.displayName || "ไม่ทราบชื่อผู้ขาย"}
              </td>
              <td className="px-4 py-3 text-left">{post.category?.name}</td>
              <td className="px-4 py-3 text-left">
                {format(new Date(post.createdAt), "yyyy-MM-dd")}
              </td>
              <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                <button
                  data-test={`post-delete-${post._id}`}
                  className="text-red-500 hover:text-red-700 transition-all"
                  onClick={() => handleDeletePost(post._id)}
                >
                  <BsTrash3 className="h-5 w-5" />
                </button>
                <a
                  href={`mod/approveposts/${post._id}`}
                  data-test={`post-check-${post._id}`}
                  className="btn-checkpost"
                >
                  ตรวจสอบโพสต์
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            data-test="pagination-prev"
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            <IoChevronBack size={20} />
          </button>
          <span className="text-base" data-test="pagination-info">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            data-test="pagination-next"
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

export default ManagePostsByMod;
