import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";  
import { FiMail, FiLock } from "react-icons/fi";

const ModLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginModWithFirebase,getUser } = useContext(AuthContext);  
  const navigate = useNavigate();


  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // เรียก login function แล้วรับข้อมูล user ที่ login สำเร็จ
    const user = await loginModWithFirebase(email, password);
    console.log("🔍 user object:", user);

     // พยายามดึง role จาก object หลายรูปแบบ (เผื่อกรณีมี nested structure)
    const userRole = user?.role || user?.data?.role || user?.user?.role;

     // ถ้าไม่พบ role → แสดง error popup แล้ว return ออกจากฟังก์ชัน
    if (!userRole) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถระบุสิทธิ์ของผู้ใช้งานได้",
        text: "กรุณาติดต่อผู้ดูแลระบบ",
      });
      return;
    }

    // แสดง popup แจ้งว่า login สำเร็จ พร้อมแจ้งว่าจะพาไปหน้าไหนตาม Role  นั้นนๆ
    Swal.fire({
      icon: "success",
      title: "เข้าสู่ระบบสำเร็จ",
      text: `กำลังพาไปยังหน้า ${userRole === "admin" ? "DashboardAdmin" : "DashboardMod"}`,
      timer: 2000,
      showConfirmButton: false,
    });

    setTimeout(() => {
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/mod");
      }
    }, 1800);

  } catch (e) {
    console.error("Login error:", e);
    Swal.fire({
      icon: "error",
      title: "เข้าสู่ระบบล้มเหลว",
      text: e.message || "โปรดตรวจสอบอีเมลและรหัสผ่านอีกครั้ง",
    });
  }
};


  return (
   <div className="min-h-screen flex items-center  justify-center bg-base-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-base-content">
        <h2 className="text-3xl font-bold text-center mb-6  text-vivid">
          เข้าสู่ระบบผู้ดูแลระบบ
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="form-control">
            <label className="label text-sm font-semibold">
              <span>อีเมล</span>
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email ที่ได้จาก ADMIN"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-control">
            <label className="label text-sm font-semibold">
              <span>รหัสผ่าน</span>
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                className="input input-bordered w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn w-full bg-vivid text-white hover:bg-primary-focus rounded-xl"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ยังไม่มีบัญชี? ติดต่อผู้ดูแลระบบเพื่อขอสมัคร <br />
          <a
            href="/mod/register"
            className="text-vivid font-semibold hover:underline"
          >
            สมัครโดย ADMIN เท่านั้น
          </a>
        </div>
      </div>
    </div>
  );
};

export default ModLogin;
