import { create } from "zustand";
import api from "../services/api.js";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isMessageLoading: false,
  isUserLoading: false,

  createChatRoom: async ({ receiverId }, socket) => {
    set({ isUserLoading: true });
    try {
      const res = await api.post("/chatroom", { receiverId });
  
      if (socket) {
        socket.emit("newChat", { to: receiverId });
      }
  
      set({ selectedUser: res.data.partner });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error while creating chat room");
    } finally {
      set({ isUserLoading: false });
    }
  },
  

  getChatRooms: async () => {
    set({ isUserLoading: true });
    try {
      const res = await api.get("/chatroom");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "Error while fetching users");
    } finally {
      set({ isUserLoading: false });
    }
  },
  
  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await api.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(
        error.response.data.message || "Error while fetching messages"
      );
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData, socket) => {
    const { selectedUser, messages } = get();
    set({ isSendingMessage: true });
    try {
      const res = await api.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      console.log(res.data);

      set({ messages: [...messages, res.data] });
      if (socket) {
        socket.emit("newMessage", res.data);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error while sending message");
    } finally {
      set({ isSendingMessage: false });
    }
  },

  subscribeToMessage: (socket) => {
    const { selectedUser } = get();
    if (!selectedUser || !socket) return;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSendFromSelectedUser) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessage: (socket) => {
    if (socket) socket.off("newMessage");
  },

  // Subscribe to chat room updates
  subscribeToChatRoom: (socket) => {
    if (!socket) return;
    socket.on("newChat", () => {
      const { getChatRooms } = get();
      getChatRooms();
    });
  },
  
  unsubscribeFromChatRoom: (socket) => {
    if (!socket) return;
    socket.off("newChat");
  },
  

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
