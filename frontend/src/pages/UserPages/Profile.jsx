import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { FaCamera } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import UserService from "../../services/user.service";



const Profile = () => {
  const auth = getAuth();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
 

  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    imageURL: "",
  });

  console.log("Sending photoURL update:", {
  userId: user,
  
});


  console.log("Data User:", user);
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const storage = getStorage();
    const fileimages = `SE-Shop/DormDeals/imageUserProfile/${
      user.uid
    }-${Date.now()}`;
    const storageRef = ref(storage, fileimages);

    await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(storageRef);

    //  อัปเดต Firebase Auth 
    await updateProfile(auth.currentUser, { photoURL: imageURL });

    //  อัปเดต MongoDBให้PhothoURLเปลี่ยนตาม
    await UserService.updateUserPhoto(user.email, imageURL);

    console.log("อัปโหลดรูปสำเร็จ:", imageURL);

    //  Update state
    setInitialData((prev) => ({ ...prev, imageURL }));
    setSelectedImg(imageURL);
    toast.success("เปลี่ยนรูปโปรไฟล์สำเร็จ");

  } catch (error) {
    console.error("อัปโหลดรูปผิดพลาด:", error);
    toast.error("ไม่สามารถเปลี่ยนรูปโปรไฟล์ได้");
  }
};

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setInitialData({
          name: currentUser.displayName,
          email: currentUser.email,
          imageURL: currentUser.photoURL,
        });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (!user) {
    return <div className="text-center pt-20">กำลังโหลดข้อมูลผู้ใช้...</div>;
  }

  return (
    <div className="h-screen pt-20">
      <div className="fixed top-0 right-0 w-auto z-50 p-4">
        <Toaster position="top-right" />
      </div>

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">โปรไฟล์ของฉัน</h1>
          </div>

          {/* รูปโปรไฟล์ */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || initialData.imageURL}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4"
              />

              {/* input file ซ่อน */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* ไอคอนกล้อง คลิกแล้วเปิดเลือกไฟล์ */}
              <div
                className="absolute bottom-0 right-0 bg-base-content p-2 rounded-full text-white opacity-80 cursor-pointer"
                title="เปลี่ยนภาพโปรไฟล์"
                onClick={() => fileInputRef.current.click()}
              >
                <FaCamera className="w-4 h-4" />
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              (คลิกไอคอนกล้องเพื่อเปลี่ยนภาพ)
            </p>
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
