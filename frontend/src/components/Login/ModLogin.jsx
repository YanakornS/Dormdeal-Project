import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import AdminService from "../../services/admin.service";
import { AuthContext } from "../../context/AuthContext";  

const ModLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginMod,loginModWithFirebase } = useContext(AuthContext);  
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginModWithFirebase(email, password);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: "กำลังพาไปยังหน้า Mod Manages",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/mod"), 1800);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบล้มเหลว",
        text: e.message || "โปรดตรวจสอบอีเมลและรหัสผ่านอีกครั้ง",
      });
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-vivid">
          เข้าสู่ระบบผู้ดูแลระบบ
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1">อีเมล</label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="กรุณาใส่Gmailที่ได้รับการสมัคจากADMIN"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">รหัสผ่าน</label>
            <input
              type="password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn w-full bg-vivid rounded-2xl text-white hover:bg-vivid-dark transition-all duration-200"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ยังไม่มีบัญชีติดต่อADMIN <a href="/mod/register" className="text-vivid font-semibold hover:underline">สมัครจากADMINเท่านั้น?</a>
        </div>
      </div>
    </div>
  );
};
export default ModLogin;
