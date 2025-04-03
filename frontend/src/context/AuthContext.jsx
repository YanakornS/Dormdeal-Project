import { createContext, useEffect, useState } from "react";
import { Cookies } from "react-cookie";
export const AuthContext = createContext();
import app from "../configs/firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  updateProfile,
} from "firebase/auth";
import UserService from "../services/user.service";

const cookies = new Cookies();

const getUser = () => {
  const userInfo = cookies.get("user") || null;
  return userInfo;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth(app);

  const logout = () => {
    return signOut(auth);
  };

  const signUpWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: "webmail.npru.ac.th" });

    return signInWithPopup(auth, provider).then((result) => {
      const email = result.user.email;
      if (!email.endsWith("@webmail.npru.ac.th")) {
        auth.signOut();
        throw new Error("กรุณาใช้บัญชีอีเมลมหาวิทยาลัยในการเข้าสู่ระบบ");
      }
      return result;
    });
  };

  const updateUserProfile = ({ name, photoURL }) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const authInfo = {
    user,
    isLoading,
    logout,
    signUpWithGoogle,
    updateUserProfile,
    getUser,
  };

  //check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUser(currentUser);
        setIsLoading(false);
        const { email, displayName, photoURL } = currentUser;
        const response = await UserService.signJwt(email, displayName, photoURL);
        if (response.data) {
          console.log(response.data);
          cookies.set("user", response.data);
        }
      } else {
        cookies.remove("user");
      }
      setIsLoading(false);
    });
    return () => {
      return unsubscribe();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
