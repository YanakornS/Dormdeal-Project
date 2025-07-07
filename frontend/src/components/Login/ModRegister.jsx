import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import AdminService from "../../services/admin.service";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import secondaryAuth from "../../configs/firebase.secondary"; 

const ModRegister = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      //  ใช้ secondaryAuth เพื่อไม่ให้เปลี่ยน user ปัจจุบัน

      //auth.currentUser จะ เปลี่ยนกลายเป็น user ใหม่ ทันที  ทำให้คุณ (admin/mod ที่กำลัง login อยู่) หลุดออกจากระบบ ซึ่งไม่ใช่สิ่งที่ต้องการ 
      //แต่เมื่อใช้ secondaryAuth จาก:มันจะ สร้างผู้ใช้ใหม่แบบแยก session → แล้วคุณก็ signOut เฉพาะ secondaryAuth ทิ้งได้ โดยไม่แตะ session หลักของ admin/mod ที่กำลังใช้งานอยู่
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);  //สร้าง user ใหม่แบบไม่กระทบ session ปัจจุบัน
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName });

      //  เพิ่มเข้า backend
      await AdminService.createMod({ email, password, displayName });

      //  signOut เฉพาะจาก secondaryAuth เหมือนเป็นตัวเเทนในการcurrentUser ทำให้หลุด login 
      await signOut(secondaryAuth);

      
      await Swal.fire({
        icon: "success",
        title: "เพิ่มผู้ดูแลระบบสำเร็จ!",
        text: `เจ้าหน้าที่ ${displayName} ถูกเพิ่มเรียบร้อยแล้ว`,
        timer: 2000,
        showConfirmButton: false,
      });

      // ล้างฟอร์ม
      setEmail("");
      setPassword("");
      setDisplayName("");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "เพิ่มผู้ดูแลระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: message,
      });
    }
  };
  //

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-vivid">เพิ่มผู้ดูแลระบบ (Mod)</h2>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">ชื่อแสดง</label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="ชื่อที่จะแสดง"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">อีเมล</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="mod@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">รหัสผ่าน</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
            />
          </div>

          <button type="submit" className="btn w-full rounded-2xl bg-vivid text-white hover:bg-vivid-dark">
            เพิ่มผู้ดูแลระบบ
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModRegister;
