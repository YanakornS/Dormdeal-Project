import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Cookies } from "react-cookie";
export const AuthContext = createContext();
import app from "../configs/firebase.config";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import UserService from "../services/user.service";

const cookies = new Cookies();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const getUser = () => cookies.get("user") || null;

  const connectSocket = (userId) => {
    if (socket?.connected || socket !== null) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      query: { userId },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket && socket.connected) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: "webmail.npru.ac.th" });

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const { email, displayName, photoURL } = user;

      if (!email.endsWith("@webmail.npru.ac.th")) {
        await signOut(auth);
        throw new Error("กรุณาใช้บัญชีอีเมลมหาวิทยาลัยในการเข้าสู่ระบบ");
      }

      await UserService.addUser(email, displayName, photoURL);

      const jwtResponse = await UserService.signJwt(
        email,
        displayName,
        photoURL
      );

      const userData = jwtResponse.data;

      if (userData) {
        cookies.set("user", userData, {
          path: "/",
          maxAge: 60 * 60 * 24,
        });

        connectSocket(userData.id);
      }
    } catch (error) {
      console.log("การเข้าสู่ระบบล้มเหลว :", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    disconnectSocket();
    cookies.remove("user");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      const jwt = cookies.get("user");
      const userId = jwt?._id;

      if (currentUser && userId && (!socket || !socket.connected)) {
        connectSocket(userId);
        console.log("เชื่อมต่อซ็อกเก็ตใหม่ด้วย ID:", userId);
      }

      if (!currentUser) {
        cookies.remove("user");
        disconnectSocket();
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    isLoading,
    logout,
    loginWithGoogle,
    getUser,
    socket,
    onlineUsers,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
