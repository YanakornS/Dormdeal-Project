import { create } from "zustand";
import api from "../services/api.js";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  chatRooms: [],
  selectedUser: null,
  isMessageLoading: false,
  isUserLoading: false,

  createChatRoom: async ({ receiverId }, socket) => {
    set({ isUserLoading: true });
    try {
      const res = await api.post("/chatroom", { receiverId });
      set({ selectedUser: res.data.receiver });
    } catch (error) {
      console.error(
        error.response?.data?.message || "Error while creating chatroom"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },

  getChatRooms: async () => {
    set({ isUserLoading: true });
    try {
      const res = await api.get("/chatroom");
      set({ chatRooms: res.data });
    } catch (error) {
      console.error(
        error.response.data.message || "Error while fetching chatrooms"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },

  markAsRead: async (receiverId) => {
    try {
      await api.post(`/chatroom/read/${receiverId}`);

      // อัปเดตสถานะ unread เป็น 0 สำหรับห้องแชท
      set((state) => {
        const updatedRooms = state.chatRooms.map((room) => {
          const isTarget = room.partner._id === receiverId;
          return isTarget ? { ...room, unread: 0 } : room;
        });

        return { chatRooms: updatedRooms };
      });
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  },

  // รวม unread ทั้งหมด
  getTotalUnread: () => {
    const { chatRooms } = get();
    return chatRooms.reduce((sum, room) => sum + room.unread, 0);
  },

  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await api.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error(
        error.response.data.message || "Error while fetching messages"
      );
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessage: true });
    try {
      const res = await api.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] }); // แสดงทันที
    } catch (error) {
      console.error(
        error.response.data.message || "Error while sending message"
      );
    } finally {
      set({ isSendingMessage: false });
    }
  },

  // Subscribe to new messages updates
  subscribeToMessage: (socket) => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      const { selectedUser, chatRooms, messages, markAsRead } = get();

      // กันข้อความซ้ำ
      const isDuplicate = messages.some((m) => m._id === message._id);
      if (isDuplicate) return;

      const senderId = message.senderId;

      const isCurrentChat = selectedUser && selectedUser._id === senderId;

      // เปิดแชท
      if (isCurrentChat) {
        set({ messages: [...messages, message] });
        // ล้าง badge
        markAsRead(senderId);
        return;
      }

      // ไม่ได้เปิดแชท (เพิ่ม badge)
      const updatedRooms = chatRooms.map((room) =>
        room.partner._id === senderId
          ? { ...room, unread: (room.unread || 0) + 1 }
          : room
      );
      set({ chatRooms: updatedRooms });
    });
  },

  // Subscribe to chat room updates
  subscribeToChatRoom: (socket) => {
    if (!socket) return;
    socket.on("newChat", () => {
      const { getChatRooms } = get();
      getChatRooms();
    });
  },

  unsubscribeFromMessage: (socket) => {
    if (!socket) return;
    socket.off("newMessage");
  },

  unsubscribeFromChatRoom: (socket) => {
    if (!socket) return;
    socket.off("newChat");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  
}));
