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

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const auth = getAuth();
  const { getUser } = useContext(AuthContext);
  const userInfo = getUser();

  const user = auth.currentUser;
  console.log("Firebase user:", user);
  const [currentUser, setCurrentUser] = useState(null);

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
        const response = await PostService.getPostByOwner(userInfo._id);

        setPosts(response.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const pendingCount = posts.filter(
    (p) => p.status === "pending_review"
  ).length;
  const revisionCount = posts.filter(
    (p) => p.status === "needs_revision"
  ).length;
  const rejectedCount = posts.filter((p) => p.status === "rejected").length;
  const soldOutCount = posts.filter((p) => p.status === "sold-out").length;

  const statusMap = {
    pending: "pending_review",
    revision: "needs_revision",
    rejected: "rejected",
    soldOut: "sold-out",
  };

  const filteredPosts = posts.filter((p) => p.status === statusMap[activeTab]);

  return (
    <div className="section-container mt-16">
      <Breadcrumbs breadcrumbMenu={breadcrumbMenu} />
      <div className="drawer drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col items-start justify-start px-6 py-4 gap-4 w-full">
          {filteredPosts.length === 0 ? (
            <p className="text-gray-500">ไม่มีโพสต์ในหมวดนี้</p>
          ) : (
            filteredPosts.map((post) => (
              <PostReviewCard post={post} onDelete={() => {
                setPosts((prev) => prev.filter((p) => p._id !== post._id));
              }} />
              
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

        {/* ✅ เมนู filter สถานะ */}
        <div className="drawer-side items-end">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu text-black mt-10 gap-4 text-base w-80 p-4 items-end bg-white pr-9">
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
