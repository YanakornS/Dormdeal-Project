// firebase.secondary.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//มันจะเปลี่ยน auth.currentUser ให้กลายเป็น user ใหม่ทันทีซึ่งทำให้ หลุดจาก session เดิม (เช่น admin/mod ที่ login อยู่) วิธีแก้ = ใช้ secondaryApp
//const secondaryAuth = getAuth(secondaryApp);
// ใช้ secondaryAuth นี้สำหรับ createUserWithEmailAndPassword ไม่แตะ auth ของ user ปัจจุบัน 


// ใช้ app config เดิม
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

//auth.currentUser จะ เปลี่ยนกลายเป็น user ใหม่ ทันที  ทำให้คุณ (admin/mod ที่กำลัง login อยู่) หลุดออกจากระบบ ซึ่งไม่ใช่สิ่งที่ต้องการ 
//แต่เมื่อใช้ secondaryAuth จาก:มันจะ สร้างผู้ใช้ใหม่แบบแยก session → แล้วคุณก็ signOut เฉพาะ secondaryAuth ทิ้งได้ โดยไม่แตะ session หลักของ admin/mod ที่กำลังใช้งานอยู่
//secondaryApp	ใช้เฉพาะตอนสมัคร user ใหม่ โดยไม่กระทบ session เดิม
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);

export default secondaryAuth;
