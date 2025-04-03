import React, { useEffect, useState } from "react";
import ModService from "../../services/mod.service";
import { format } from "date-fns";
import { BsTrash3 } from "react-icons/bs";
import Swal from "sweetalert2";

const ManagePostsByMod = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await ModService.getAllPostsProductByMod();
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
      text: "Do you want to deltete this post?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        ModService.deletePostProductByMod(id);
        Swal.fire({
          title: "Delete Post",
          text: "Delete successfully",
          icon: "success",
        }).then(() => {
          window.location.reload();
        });
      }
    });
  };

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
        <tbody >
          {posts.map((post) => (
            <tr
              key={post._id}
              className=" hover:bg-gray-100 transition-all"
            >
              <td className="px-4 py-3 text-left">{post.productName}</td>
              <td className="px-4 py-3 text-left">{post.owner.displayName}</td>
              <td className="px-4 py-3 text-left">
                {post.category?.name}
              </td>
              <td className="px-4 py-3 text-left">
                {format(new Date(post.createdAt), "yyyy-MM-dd")}
              </td>
              <td className="px-4 py-3 text-center flex items-center justify-center gap-3">
                <button className="text-red-500 hover:text-red-700 transition-all" onClick={() => handleDeletePost(post._id)}>
                  <BsTrash3 className="h-5 w-5" />
                </button>
                <button className="btn-checkpost">ตรวจสอบโพสต์</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    
  );
};

export default ManagePostsByMod;
