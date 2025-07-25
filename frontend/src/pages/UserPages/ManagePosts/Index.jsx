import { useState, useEffect } from "react";
import { useParams } from "react-router";
import PostService from "../../../services/postproduct.service";
import PostProfileCard from "../../../components/PostProfileCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";


//imporn icon
import { LuEye } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { LuStar } from "react-icons/lu";
import { MdOutlinePersonOutline } from "react-icons/md";

const Index = () => {
  //products ทำหน้าที่ state เก็บรายการสินค้า (เฉพาะที่ approved และจำกัด 5 รายการ)
  const [products, setProducts] = useState([]);
  //ดึง id จาก URL ผ่าน useParams()
  const { id } = useParams();
  //สร้าง state: products, currentUser
  const [currentUser, setCurrentUser] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const [soldCount, setSoldCount] = useState(0);

  //ตรวจสอบผู้ใช้ผ่าน  Auth
  //เมื่อมีการเปลี่ยนแปลงสถานะการล็อกอิน จะเก็บข้อมูลผู้ใช้ไว้ใน currentUser เเละใช้ onAuthStateChanged ของ Firebase

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); //// ถ้ามีผู้ใช้ล็อกอินอยู่ จะเก็บไว้ใน currentUser
    });

    return () => unsubscribe();
  }, []);
  //onAuthStateChanged จะทำงานเรียก callback ทุกครั้งที่สถานะการล็อกอินเปลี่ยนแปลงเช่น ล็อกอินสำเร็จ, ออกจากระบบ

  //ดึงโพสต์จากเจ้าของ ตาม id
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await PostService.getPostByOwner(id);

        //  กรองเฉพาะโพสต์ที่ approved และเอาแค่ 5 อันแรก
        const approvedPosts = response.data
          .filter((post) => post.status === "approved")
          .slice(0, 5); //  จำกัดจำนวนไม่เกิน 5 โพสต์

        setProducts(approvedPosts); //เก็บลงใน products เฉพาะโพสต์ที่ approved หรือผ่่านการอนุมัติแล้ว
        // นับจำนวนโพสต์ที่มีสถานะ sold
        //  ใช้ filter เพื่อกรองโพสต์ที่มีสถานะ sold
        const soldPosts = response.data.filter(
          (post) => post.status === "sold"
        );
        setSoldCount(soldPosts.length); // เก็บจำนวนสินค้า sold
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (id) fetchProducts();
  }, [id]);

  console.log("UserSSS", user);

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
            <span className="ml-2">คะแนนเรทติ้ง : </span>
          </span>
        </div>
      </div>

      {/* รายการสินค้า */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map(
          (
            product //คือวนลูปในรายการสินค้าใน products
          ) => (
            <PostProfileCard key={product._id} product={product} />
            //ใช้ PostProfileCard แสดงแต่ละสินค้า
          )
        )}
      </div>
    </div>
  );
};

export default Index;
