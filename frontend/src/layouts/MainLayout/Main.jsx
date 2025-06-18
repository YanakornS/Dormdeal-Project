import { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../../components/UserComponents/UserNavbar";
import Footer from "../../components/Footer";
import { useChatStore } from "../../stores/useChatStore";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const UserLayout = () => {
const { getChatRooms, subscribeToMessage, unsubscribeFromMessage } = useChatStore();
  const { socket } = useContext(AuthContext);

useEffect(() => {
  getChatRooms(); // ดึง unread
  unsubscribeFromMessage(socket); // ลบ event เก่า
  subscribeToMessage(socket); // เพิ่ม badge
  return () => {
    unsubscribeFromMessage(socket);
  };
}, [getChatRooms, socket]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-[height-of-navbar]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
