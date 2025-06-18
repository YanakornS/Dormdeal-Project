import { useEffect, useState, useContext } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { AuthContext } from "../../context/AuthContext";
import SidebarSkeleton from "../Skeletons/SidebarSkeleton";
import { UsersRound } from "lucide-react";

const Sidebar = () => {
  const {
    chatRooms,
    selectedUser,
    setSelectedUser,
    isUserLoading,
    getChatRooms,
    subscribeToMessage,
    subscribeToChatRoom,
    unsubscribeFromMessage,
    unsubscribeFromChatRoom,
    markAsRead,
  } = useChatStore();

  const { socket, onlineUsers } = useContext(AuthContext);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  // ดึงห้องแชทและข้อความใหม่
  useEffect(() => {
    getChatRooms();
    subscribeToChatRoom(socket);
    subscribeToMessage(socket);
    return () => {
      unsubscribeFromChatRoom(socket);
      unsubscribeFromMessage(socket);
    };
  }, [getChatRooms, socket]);

  // คนที่ออนไลน์ และ มีห้องแชท
  const onlineChatUsers = chatRooms.filter((r) =>
    onlineUsers.includes(r.partner?._id)
  );
  
  // กรองห้องแชทตามผู้ใช้ที่ออนไลน์
  const filteredRooms = showOnlineOnly
    ? chatRooms.filter((r) => onlineUsers.includes(r.partner._id))
    : chatRooms;

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <UsersRound className="size-6" />
          <span className="font-medium hidden lg:block">ติดต่อ</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">ผู้ใช้ที่กำลังออนไลน์</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineChatUsers.length} ออนไลน์)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredRooms.map(({ partner, unread }) => (
          <button
            key={partner._id}
            onClick={() => {
              setSelectedUser(partner);
              if (selectedUser?._id !== partner._id) {
                markAsRead(partner._id); // ป้องกันเรียกซ้ำ
              }
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === partner._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={partner.photoURL || "/avatar.webp"}
                alt={partner.displayName}
                className="size-12 object-cover rounded-full"
              />

              {onlineUsers.includes(partner._id) && (
                <>
                  <span className="absolute bottom-0 right-0 size-3 bg-green-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white"></span>
                </>
              )}

              {unread > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md z-10">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{partner.displayName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(partner._id) ? "ออนไลน์" : "ออฟไลน์"}
              </div>
            </div>
          </button>
        ))}

        {filteredRooms.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            ไม่พบผู้ใช้ออนไลน์
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
