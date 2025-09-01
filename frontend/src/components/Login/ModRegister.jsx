import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { AuthContext } from "../../context/AuthContext";

//import icon
import { FaUserPen } from "react-icons/fa6";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineAddModerator } from "react-icons/md";

const ModRegister = () => {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const { createUserWithEmailAndPasswordHandler } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const result = await createUserWithEmailAndPasswordHandler(
        email,
        password,
        displayName
      );
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ",
          text: "สามารถเข้าสู่ระบบผู้ดูแลระบบได้แล้ว",
          timer: 2000,
          showConfirmButton: false,
        });
        setEmail("");
        setPassword("");
        setDisplayName("");
      } else {
        Swal.fire({
          icon: "error",
          title: "สมัครสมาชิกไม่สำเร็จ",
          text: result.error || "ไม่สามารถสร้างผู้ใช้ได้",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "สมัครสมาชิกไม่สำเร็จ",
        text: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 text-base-content p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-base-content">
        <h2
          data-test="page-title"
          className="text-3xl font-bold text-center mb-8 text-vivid"
        >
          เพิ่มผู้ดูแลระบบ (Mod)
        </h2>

        <form
          data-test="mod-register-form"
          onSubmit={handleRegister}
          className="space-y-6"
        >
          {/* Display Name */}
          <div>
            <label
              htmlFor="displayName"
              data-test="label-displayName"
              className="block text-sm font-semibold mb-2"
            >
              ชื่อแสดง
            </label>
            <div className="relative">
              <FaUserPen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="displayName"
                data-test="input-displayName"
                type="text"
                className="input input-bordered w-full pl-10"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="ชื่อที่จะแสดง"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              data-test="label-email"
              className="block text-sm font-semibold mb-2"
            >
              อีเมล
            </label>
            <div className="relative">
              <MdOutlineMarkEmailRead className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                data-test="input-email"
                type="email"
                className="input input-bordered w-full pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="mod@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              data-test="label-password"
              className="block text-sm font-semibold mb-2"
            >
              รหัสผ่าน
            </label>
            <div className="relative">
              <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                data-test="input-password"
                type="password"
                className="input input-bordered w-full pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            data-test="submit-btn"
            type="submit"
            className="btn w-full rounded-2xl bg-vivid text-white hover:bg-vivid-dark transition-all duration-200 flex items-center justify-center gap-2"
          >
            <MdOutlineAddModerator className="text-xl" />
            เพิ่มผู้ดูแลระบบ
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModRegister;
