import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PostService from "../../../services/postproduct.service";
import RatingService from "../../../services/rating.service";
import PostProfileCard from "../../../components/PostProfileCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { LuEye } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { LuStar } from "react-icons/lu";
import { MdOutlinePersonOutline } from "react-icons/md";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [soldCount, setSoldCount] = useState(0);
  const [averageRating, setAverageRating] = useState(null);

  const { id } = useParams();

  // ตรวจสอบผู้ใช้
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // ดึงโพสต์ของเจ้าของ
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await PostService.getPostByOwner(id);
        const approvedPosts = response.data
          .filter((post) => post.status === "approved")
          .slice(0, 5);

        setProducts(approvedPosts);

        const soldPosts = response.data.filter(
          (post) => post.status === "sold"
        );
        setSoldCount(soldPosts.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    if (id) fetchProducts();
  }, [id]);

  useEffect(() => {
    const fetchRating = async () => {
      if (!id) return;
      try {
        const res = await RatingService.getSellerRatings(id);
        const avgRating = res.data?.data?.stats?.averageRating;

        if (avgRating !== undefined && avgRating !== null) {
          setAverageRating(avgRating);
        } else {
          setAverageRating("ยังไม่มีคะแนน");
        }
      } catch (err) {
        console.error("Error fetching ratings:", err);
        setAverageRating("ยังไม่มีคะแนน");
      }
    };

    fetchRating();
  }, [id]);

  return (
    <div className="section-container pt-24 max-w-screen-xl mx-auto px-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <div className="profile pt-8 flex justify-center md:justify-start">
          <img
            src={currentUser?.photoURL}
            alt="Profile"
            className="rounded-full w-32 h-32 md:w-40 md:h-40"
          />
        </div>

        <div className="flex flex-col gap-4 py-8 px-6 text-center md:text-left text-base">
          <span className="flex items-center justify-center md:justify-start">
            <MdOutlinePersonOutline />
            <span className="ml-2">{currentUser?.displayName}</span>
          </span>
          <span className="flex items-center justify-center md:justify-start">
            <LuEye />
            <span className="ml-2">
              จำนวนรายการสินค้าทั้งหมด : {products.length} รายการ
            </span>
          </span>
          <span className="flex items-center justify-center md:justify-start">
            <FiBox />
            <span className="ml-2">
              จำนวนสินค้าที่ปิดการขายสำเร็จ : {soldCount} รายการ
            </span>
          </span>
          <span className="flex items-center justify-center md:justify-start">
            <LuStar />
            <span className="ml-2">
              คะแนนเรทติ้ง : {averageRating ?? "กำลังโหลด..."}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <PostProfileCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Index;
