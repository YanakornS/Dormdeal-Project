import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaCamera } from "react-icons/fa";

const Profile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null); //เก็บข้อมูลผู้ใช้ที่ล็อกอินอยู่
  
  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    imageURL: "", 
  });//เก็บข้อมูลเริ่มต้นของผู้ใช้ เช่น ชื่อ, อีเมล และรูปภาพ
  //ดึงชื่อ, อีเมล และรูปภาพจาก initialData แสดงแบบไม่ให้แก้ไข (เหมาะกับ read-only profile)
 

  //ใช้ onAuthStateChanged เพื่อดึงข้อมูลผู้ใช้เมื่อโหลดหน้า
  //ถ้ามีผู้ใช้ล็อกอิน จะเก็บข้อมูลไว้ใน state user และ initialData
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // ดึงชื่อ, อีเมล และรูปภาพจาก currentUser

        setInitialData({
          name: currentUser.displayName ,
          email: currentUser.email ,
          imageURL: currentUser.photoURL ,
        });


      }
    });

    // ถ้าไม่มีผู้ใช้ล็อกอิน จะรีเซ็ตข้อมูล
    return () => unsubscribe();
  }, [auth]);


  if (!user) {
    return <div className="text-center pt-20">กำลังโหลดข้อมูลผู้ใช้...</div>;
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">โปรไฟล์ของฉัน</h1>
          </div>

          
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={initialData.imageURL} // ใช้ imageURL จาก initialData
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4"
              />
              
              <div
                className="absolute bottom-0 right-0 bg-base-content p-2 rounded-full text-white opacity-80"
                title="ไม่สามารถเปลี่ยนภาพได้"
              >
                <FaCamera className="w-4 h-4" />
              </div>
            </div>
            <p className="text-sm text-zinc-400">(กดไอคอนกล้องเพื่อเปลี่ยนภาพ)</p>
          </div>

          {/* ข้อมูลผู้ใช้ */}
          <div className="space-y-6 mt-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400">ชื่อผู้ใช้</div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {initialData.name} 
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400">อีเมล</div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {initialData.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
