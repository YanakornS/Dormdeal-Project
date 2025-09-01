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
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
    //เช็ค Socket เชื่อมอยู่มั้ย
    if (socket?.connected || socket !== null) return;

    const socketURL = import.meta.env.VITE_SOCKET_URL;
    const newSocket = io(socketURL, {
      query: { userId }, // ส่ง userId ไป backend
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    // เก็บ userId ใน onlineUsers
    newSocket.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket && socket.connected) {
      socket.disconnect();
      setSocket(null);
    }
  };

 // Login & Register With Google
 const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ hd: "webmail.npru.ac.th" });

  try {
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    const { email, displayName, photoURL } = firebaseUser;

    if (!email.endsWith("@webmail.npru.ac.th")) {
      await signOut(auth);
      throw new Error("กรุณาใช้บัญชีอีเมลมหาวิทยาลัยในการเข้าสู่ระบบ");
    }

    await UserService.addUser(email, displayName, photoURL);

    const idToken = await firebaseUser.getIdToken();
    console.log("idToken", idToken);

    const jwtResponse = await UserService.signJwt(idToken);

    const userData = jwtResponse.data;

    // Set Cookies + Connect Socket
    if (userData) {
      cookies.set("user", userData, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      connectSocket(userData._id);
    }
  } catch (error) {
    console.log("Login failed:", error);
  }
};

// Sign in with email and password (for admin/mod use)
const signInWithEmailAndPasswordHandler = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;
    console.log("firebaseUser", firebaseUser);

    const idToken = await firebaseUser.getIdToken();
    console.log("idToken", idToken);

    const jwtResponse = await UserService.signJwt(idToken);

    const userData = jwtResponse.data;

    // Set Cookies + Connect Socket
    if (userData) {
      cookies.set("user", userData, {
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      connectSocket(userData._id);
    }
    return { success: true, user: userData };
  } catch (error) {
    console.log("Sign in failed:", error);
    return { success: false, error: error.message };
  }
};

// Create mod user with email and password (for admin to add mod only)
const createUserWithEmailAndPasswordHandler = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await UserService.addModUser({
      email,
      displayName,
      role: "mod",
    });

    return { success: true};
  } catch (error) {
    console.log("Create mod user failed:", error);
    return { success: false, error: error.message };
  }
};


  const logout = async () => {
    await signOut(auth);
    disconnectSocket();
    cookies.remove("user");
  };

  useEffect(() => {
    
    // ตรวจสอบสถานะ
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);

      const jwt = cookies.get("user");
      const userId = jwt?._id;

      // มีทั้งคู่และเชื่อมต่อ Socket
      if (currentUser && userId && (!socket || !socket.connected)) {
        connectSocket(userId);
        console.log("Reconnected socket with ID:", userId);
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
    signInWithEmailAndPasswordHandler,
    createUserWithEmailAndPasswordHandler,
    getUser,
    socket,
    onlineUsers,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
