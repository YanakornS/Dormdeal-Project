import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";
import { FiMail, FiLock } from "react-icons/fi";

const ModLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInWithEmailAndPasswordHandler, getUser } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await signInWithEmailAndPasswordHandler(email, password);
      if (result.success) {
        const user = result.user;
        Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        timer: 2000,
        showConfirmButton: false,
        didOpen: () => {
        const title = document.querySelector(".swal2-title");
        if (title) {
        title.setAttribute("data-test", "swal-login-success");
    }
  },
});

        navigate(user.role === "mod" ? "/mod" : "/admin");
      } else {
        Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center  justify-center bg-base-200 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-base-content">
        <h2 className="text-3xl font-bold text-center mb-6  text-vivid" data-test="mod-login-title">
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
                data-test="modlogin-email"
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
                data-test="modlogin-password"
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
            data-test="modlogin-button-submit"
            className="btn w-full bg-vivid text-white hover:bg-primary-focus rounded-xl"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ยังไม่มีบัญชี? ติดต่อผู้ดูแลระบบเพื่อขอสมัคร <br />
          <a
            href="/mod/register"
            data-test="modlogin-link-register"
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
