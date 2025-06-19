import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Breadcrumbs from "../../components/Breadcrumb";
import PostService from "../../services/postproduct.service";
import PostReviewCard from "../../components/PostReviewCard";
import ProductCard from "../../components/ProductCard";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

const ManagePostStatus = () => {
  const breadcrumbMenu = [
    { name: "หน้าแรก", link: "/" },
    { name: "จัดการโพสต์ประกาศ", link: "#" },
  ];

  const [posts, setPosts] = useState([]); //เก็บ รายการโพสต์ของผู้ใช้ทั้งหมดค่าเริ่มต้นคือ [] ว่าง
  const [activeTab, setActiveTab] = useState("pending");  //activeTab เก็บว่า ขณะนี้ผู้ใช้เลือกดูโพสต์ในสถานะอะไร ค่าเริ่มต้นคือ "pending" 
  const auth = getAuth();
  const { getUser } = useContext(AuthContext);
  const userInfo = getUser();

  const user = auth.currentUser;
  console.log("ผู้ใช้ Firebase :", user);
  const [currentUser, setCurrentUser] = useState(null);

  //ตรวจสอบสถานะผู้ใช้ จากFirebase
  //ตรวจสอบผู้ใช้ล็อกอินอยู่หรือไม่ และเก็บไว้ใน currentUser
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
        //ดึงโพสต์ของผู้ใช้ที่ล็อกอินอยู่ โดยใช้ _id จาก getUser() ใน Context ที่ถูกเก็บไว้ในตัวแปร userInfo
        const response = await PostService.getPostByOwner(userInfo._id);

        setPosts(response.data);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลผลิตภัณฑ์ :", error);
      }
    };

    fetchProducts();
  }, []);

  //นับจำนวนตามโพสต์แต่ละสถานะ เอาไว้แสดงจำนวนใน Sidebar
  //โดยใช้ filter เพื่อกรองโพสต์ที่มีสถานะต่างๆ
  const pendingCount = posts.filter(
    (p) => p.status === "pending_review"
  ).length;
  const revisionCount = posts.filter(
    (p) => p.status === "needs_revision"
  ).length;
  const rejectedCount = posts.filter((p) => p.status === "rejected").length;
  // นับจำนวนโพสต์ที่ปิดการขาย
  // โดยใช้ filter เพื่อกรองโพสต์ที่มีสถานะ "sold-out"
  const soldOutCount = posts.filter((p) => p.status === "sold-out").length;
  
  // แสดงเฉพาะโพสต์ที่มีสถานะตรงกับแท็บที่ผู้ใช้เลือก
  const statusMap = {
    pending: "pending_review",
    revision: "needs_revision",
    rejected: "rejected",
    soldOut: "sold-out",
  };

  // กรองโพสต์ตามสถานะที่เลือก
  const filteredPosts = posts.filter((p) => p.status === statusMap[activeTab]);
  //คือการ กรองโพสต์ (posts) ให้เหลือเฉพาะโพสต์ที่มี status ตรงกับ แท็บที่ผู้ใช้เลือกอยู่ (activeTab)
  return (
    <div className="section-container mt-16">
      <Breadcrumbs breadcrumbMenu={breadcrumbMenu} />
      <div className="drawer drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        
        <div className="drawer-content flex flex-col items-start justify-start px-6 py-4 gap-4 w-full">
          {/* 	ถ้าไม่มีโพสต์ในสถานะนี้เลย ให้แสดงข้อความ “ไม่มีโพสต์ในหมวดนี้”*/}
          {filteredPosts.length === 0 ? (
            <p className="text-gray-500">ไม่มีโพสต์ในหมวดนี้</p>
          ) : (
            //ถ้ามีโพสต์ จะแสดงแต่ละโพสต์ผ่านคอมโพเนนต์ PostReviewCard
            filteredPosts.map((post) => (

              <PostReviewCard
                post={post} // ส่งโพสต์แต่ละอันไปที่คอมโพเนนต์ PostReviewCard
                onDelete={() => {
                  setPosts((prev) => prev.filter((p) => p._id !== post._id));
                }}
                //ทำไมต้องมี onDelete? เป็นการแก้ไข posts ใน local state จะทำให้ filteredPosts ก็เปลี่ยนตามทันที
              />
            ))
          )}
        </div>

        {/* <div className="drawer-content flex flex-col items-start justify-start px-6 py-4 gap-4 w-full">
  {filteredPosts.length === 0 ? (
    <p className="text-gray-500">ไม่มีโพสต์ในหมวดนี้</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {filteredPosts.map((post) => (
        <ProductCard key={post._id} product={post} />
      ))}
    </div>
  )}
</div> */}

        {/*  เมนู filter สถานะ */}
        <div className="drawer-side items-end">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu  mt-10 gap-4 text-base w-80 p-4 items-end  pr-9">
            <li>
              <button onClick={() => setActiveTab("pending")}>
                รอการตรวจสอบ ({pendingCount})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("revision")}>
                รอการแก้ไข ({revisionCount})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("rejected")}>
                ไม่ผ่านการตรวจสอบ ({rejectedCount})
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab("soldOut")}>
                ปิดการขาย ({soldOutCount})
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagePostStatus;
