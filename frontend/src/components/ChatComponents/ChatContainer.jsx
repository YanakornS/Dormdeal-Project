import { useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useChatStore } from "../../stores/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../Skeletons/MessageSkeleton";

import { formatMessageTime, formatPrice } from "../../libs/utils";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    isMessageLoading,
    subscribeToMessage,
    unsubscribeFromMessage,
    getMessage,
    markAsRead,
  } = useChatStore();

  const { socket, getUser } = useContext(AuthContext);
  const messageEndRef = useRef(null);
  const userInfo = getUser();

  useEffect(() => {
  if (selectedUser && socket) {
    getMessage(selectedUser._id);
    markAsRead(selectedUser._id);
    subscribeToMessage(socket);
  }
  return () => {
    unsubscribeFromMessage(socket); 
  };
}, [selectedUser, socket]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === userInfo._id ? "chat-end" : "chat-start" // chat-end ขวา และ chat-start ซ้าย
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <img
                  src={
                    message.senderId === userInfo._id
                      ? userInfo.photoURL || "/avatar.webp"
                      : selectedUser.photoURL || "/avatar.webp"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className="chat-bubble flex flex-col gap-2">
              {message.postId && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center bg-base-100 w-full p-3 rounded-xl shadow-sm border border-base-300 gap-3 sm:gap-4">
                  <img
                    src={message.postId.images?.[0]}
                    alt="ProductCard"
                    className="w-full sm:w-20 h-auto sm:h-20 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex flex-col justify-between flex-1">
                    <h3 className="text-sm font-semibold  leading-snug break-all overflow-hidden line-clamp-1">
                      {message.postId.productName}
                    </h3>
                    <p className="text-green-600 font-bold text-sm mt-1">
                      {formatPrice(message.postId.price)}
                    </p>
                  </div>

                  <div className="w-full sm:w-auto">
                    <a
                      href={`/postproductdetail/${message.postId._id}`}
                      className="btn btn-sm text-vivid w-full sm:w-auto"
                    >
                      ดูโพสต์
                    </a>
                  </div>
                </div>
              )}

              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] w-full rounded-md mb-2"
                />
              )}

              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
