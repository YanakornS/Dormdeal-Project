import { useEffect, useState } from "react";
import ModService from "../../services/mod.service";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { BsTrash3 } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const ManagePostsByMod = () => {
  const [posts, setPosts] = useState([]);

 
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await ModService.getAllPostsByMod();
        setPosts(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผลิตภัณฑ์ :", error);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = (id) => {
    Swal.fire({
      title: "ลบโพสต์",
      text: "คุณต้องการลบโพสต์นี้หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่",
      cancelButtonText: "ไม่",
    }).then((result) => {
      if (result.isConfirmed) {
        ModService.deletePostProductByMod(id);
        Swal.fire({
          title: "ลบโพสต์สำเร็จ",
          text: "โพสต์ถูกลบเรียบร้อยแล้ว",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      }
    });
  };

  return (
    <div className="section-container overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-22">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">อนุมัติโพสต์ซื้อขาย</h2>
      </div>

      <table className="table">
        <thead className="bg-base-200 text-base-content">
          <tr>
            <th>ชื่อสินค้า</th>
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
                {post.owner?.displayName || "ไม่ทราบชื่อผู้ขาย"}
              </td>
              <td className="px-4 py-3 text-left">{post.category?.name}</td>
              <td className="px-4 py-3 text-left">
                {format(new Date(post.createdAt), "yyyy-MM-dd")}
              </td>
              <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                <button
                  className="text-red-500 hover:text-red-700 transition-all"
                  onClick={() => handleDeletePost(post._id)}
                >
                  <BsTrash3 className="h-5 w-5" />
                </button>
                <a
                  href={`mod/approveposts/${post._id}`}
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
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-base-200 hover:bg-base-300"
            }`}
          >
            <IoChevronBack size={20} />
          </button>
          <span className="text-base">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
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

export default ManagePostsByMod;
