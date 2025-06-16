import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PostService from "../../../services/postproduct.service";
import ProductCard from "../../../components/ProductCard";

import { getAuth, onAuthStateChanged } from "firebase/auth";


import { LuEye } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { LuStar } from "react-icons/lu";
import { MdOutlinePersonOutline } from "react-icons/md";

const Index = () => {
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);


  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await PostService.getPostByOwner(id); // เรียก API
        setProducts(response.data); // อัปเดต state
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผลิตภัณฑ์ :", error);
      }
    };

    fetchProducts();
  }, []);

  console.log( "เช็คผู้ใช้ :", user);
  

  return (
    <div className="section-container pt-24 max-w-screen-xl mx-auto px-4">
      {/* <Breadcrumbs breadcrumbMenu={breadcrumbMenu} /> */}
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
            <span className="ml-2">จำนวนรายการสินค้าทั้งหมด : {products.length} รายการ</span>
          </span>
          <span className="flex items-center justify-center md:justify-start">
            <FiBox />
            <span className="ml-2">จำนวนสินค้าที่ปิดการขายสำเร็จ :</span>
          </span>
          <span className="flex items-center justify-center md:justify-start">
            <LuStar />
            <span className="ml-2">คะแนนเรทติ้ง : </span>
          </span>
        </div>
      </div>

      {/* รายการสินค้า */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Index;
