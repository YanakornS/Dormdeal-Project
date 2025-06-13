import React, { useEffect, useState } from "react";

import ModService from "../../services/mod.service";
import { format } from "date-fns";
import { BsTrash3 } from "react-icons/bs";
import Swal from "sweetalert2";

import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";

const ManagePostsByMod = () => {
  const [posts, setPosts] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await ModService.getAllPostsByMod();
        setPosts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = (id) => {
    Swal.fire({ 
      title: "Delete",
      text: "Do you want to delete this post?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        ModService.deletePostProductByMod(id);
        Swal.fire({ title: "Deleted!", text: "Post has been removed.", icon: "success" }).then(
          () => window.location.reload()
        );
      }
    });
  };

  // pagination
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = posts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="section-container overflow-x-auto rounded-box border border-base-content/5 bg-base-100 p-28">
      <table className="table">
        {/* head */}
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
          {currentPosts.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                ไม่มีโพสต์
              </td>
            </tr>
          ) : (
            currentPosts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-100 transition-all">
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
            ))
          )}

        </tbody>
      </table>

      {/* pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
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
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 disabled:opacity-50 rounded"
        >
          <MdArrowForwardIos />
        </button>
      </div>
    </div>
  );
};

export default ManagePostsByMod;
