import logo from "/Logo/LogoDormdeals.png";
import universityLogo from "/Logo/university.png";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router";
import UserService from "../../services/user.service";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const Modal = ({ name }) => {
  const { signUpWithGoogle } = useContext(AuthContext);

  const googleSignUp = () => {
    signUpWithGoogle()
      .then(async (result) => {
        const user = result.user;
        console.log(user);
        await UserService.addUser(user.email, user.displayName, user.photoURL);
        Swal.fire({
          icon: "success",
          title: "ลงชื่อเข้าใช้สำเร็จ!",
          showConfirmButton: false,
          timer: 2000,
        });
        document.getElementById("login").close();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด!",
          text: error.message,
          showConfirmButton: false,
        });
        document.getElementById("login").close();
      });
  };

  return (
    <dialog id={name} className="modal">
      <div className="modal-box flex flex-col items-center text-center p-6 w-full max-w-[600px]">
        <img src={logo} alt="DormDeals Logo" className="h-12 mb-6" />

        <button className="flex items-center justify-center btn-sign rounded-lg mt-8" onClick={googleSignUp}>
          <img
            src={universityLogo}
            alt="University Logo"
            className="h-16 sm:h-20 mr-3"
          />

          <span className="text-base sm:text-lg font-medium">
            ลงชื่อเข้าใช้ด้วยอีเมลมหาวิทยาลัย
          </span>
        </button>

        <p className="text-xs sm:text-sm text-gray-500 mt-16 sm:mt-20 px-4">
          ข้อตกลงและเงื่อนไขการยอมรับ
          <a href="#" className="text-vivid underline mx-1">
            ข้อกำหนดในการให้บริการ
          </a>
          ของ DormDeals และรับทราบว่า
          <a href="#" className="text-vivid underline mx-1">
            นโยบายความเป็นส่วนตัว
          </a>
          ของ DormDeals มีผลบังคับใช้กับคุณ
        </p>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default Modal;
