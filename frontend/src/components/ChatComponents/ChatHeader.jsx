import { X } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useChatStore } from "../../stores/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useContext(AuthContext);

  if (!selectedUser) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.photoURL || "/avatar.webp"}
                alt={selectedUser.displayName || "User"}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.displayName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "ออนไลน์" : "ออฟไลน์"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
