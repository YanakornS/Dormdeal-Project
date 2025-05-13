import { useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useChatStore } from "../../stores/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";

import { formatMessageTime, formatPrice } from "../../libs/utils";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    isMessageLoading,
    subscribeToMessage,
    unsubscribeFromMessage,
    getMessage,
  } = useChatStore();

  const { socket, getUser } = useContext(AuthContext);
  const messageEndRef = useRef(null);
  const userInfo = getUser();

  useEffect(() => {
    if (selectedUser) {
      getMessage(selectedUser._id);
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
              message.senderId === userInfo._id ? "chat-end" : "chat-start"
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
                <div className="flex items-center bg-base-100 w-80 p-3 rounded-xl shadow-sm border border-base-300 hover:shadow-md transition">
                  <img
                    src={message.postId.images?.[0]}
                    alt={message.postId.productName}
                    className="w-20 h-20 object-cover rounded-lg mr-4 flex-shrink-0"
                  />

                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-zinc-800 leading-snug line-clamp-1">
                      {message.postId.productName}
                    </h3>
                    <p className="text-green-600 font-bold text-sm mt-1">
                      {formatPrice(message.postId.price)}
                    </p>

                    <a
                      href={`/postproductdetail/${message.postId._id}`}
                      className="text-sm text-blue-600 hover:underline mt-1 self-start"
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
                  className="sm:max-w-[200px] rounded-md mb-2"
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
