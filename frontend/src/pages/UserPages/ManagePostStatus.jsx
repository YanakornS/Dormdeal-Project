import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Breadcrumbs from "../../components/Breadcrumb";
import PostService from "../../services/postproduct.service";
import PostReviewCard from "../../components/PostReviewCard";
import ProductCard from "../../components/ProductCard";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

//imporn icon
import { CgMenuRound } from "react-icons/cg";
import { BsPostcard } from "react-icons/bs";

const ManagePostStatus = () => {
  const breadcrumbMenu = [
    { name: "หน้าแรก", link: "/" },
    { name: "จัดการโพสต์ประกาศ", link: "#" },
  ];

  const [posts, setPosts] = useState([]); //เก็บ รายการโพสต์ของผู้ใช้ทั้งหมดค่าเริ่มต้นคือ [] ว่าง
  const [activeTab, setActiveTab] = useState("pending"); //activeTab เก็บว่า ขณะนี้ผู้ใช้เลือกดูโพสต์ในสถานะอะไร ค่าเริ่มต้นคือ "pending"
  const auth = getAuth();
  const { getUser } = useContext(AuthContext);
  const userInfo = getUser();
  const [showMenu, setShowMenu] = useState(false);

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
  const soldOutCount = posts.filter((p) => p.status === "sold").length;

  // แสดงเฉพาะโพสต์ที่มีสถานะตรงกับแท็บที่ผู้ใช้เลือก
  const statusMap = {
    pending: "pending_review",
    revision: "needs_revision",
    rejected: "rejected",
    soldOut: "sold",
  };

  // กรองโพสต์ตามสถานะที่เลือก
  const filteredPosts = posts.filter((p) => p.status === statusMap[activeTab]);
  //คือการ กรองโพสต์ (posts) ให้เหลือเฉพาะโพสต์ที่มี status ตรงกับ แท็บที่ผู้ใช้เลือกอยู่ (activeTab)
  return (
    <div className="section-container   mt-20">
      <Breadcrumbs breadcrumbMenu={breadcrumbMenu} />

      {/* ปุ่มเปิดเมนู (แสดงบนจอเล็ก) */}
      <div className="block  md:hidden   mb-4">
        <button
          className="btn btn-sm  btn-outline  flex items-center bg-base-100    gap-2 rounded-xl border-1  hover:bg-base-200"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <CgMenuRound className="text-2xl " />
          <span>เมนู</span>
        </button>
      </div>

      <div className="flex  flex-col lg:flex-row border-t border-gray-300  gap-4">
        {/* Sidebar เมนู */}
        <div
          className={`${
            showMenu ? "block" : "hidden"
          } md:block w-full lg:w-64 bg-base-100  p-2   rounded `}
        >
          <ul className="menu  gap-3 text-base border-r border-gray-300  ho flex flex-col">
            <li>
              <button
                onClick={() => {
                  setActiveTab("pending");
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 rounded"
              >
                รอการตรวจสอบ ({pendingCount})
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("revision");
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 rounded `}
              >
                รอการแก้ไข ({revisionCount})
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("rejected");
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 rounded `}
              >
                ไม่ผ่านการตรวจสอบ ({rejectedCount})
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("soldOut");
                  setShowMenu(false);
                }}
                className={`w-full text-left px-4 py-2 rounded `}
              >
                ปิดการขาย ({soldOutCount})
              </button>
            </li>
          </ul>
        </div>

        {/* เนื้อหาหลัก */}
        <div className="flex-1 flex px-6 py-4  flex-col gap-2">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full  text-center   text-gray-500 min-h-[25vh] flex flex-col items-center justify-center">
              <BsPostcard className="text-gray-700 mb-2" size={64} />
              <h4 className="text-lg font-bold text-gray-600">
                ไม่พบโพสต์ในหมวดนี้
              </h4>
              <p>ลองเลือกหมวดหมู่อื่น</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostReviewCard
                key={post._id}
                post={post}
                onDelete={() =>
                  setPosts((prev) => prev.filter((p) => p._id !== post._id))
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePostStatus;
