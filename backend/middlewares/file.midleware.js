const multer = require("multer");
const path = require("path");

const firebaseConfig = require("../configs/firebase.config");

const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");

//init firebase
const app = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(app);

//Set Storage engine
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

const uploads = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4000000 }, //4MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb); //Check file exit
  },
}).array("files", 4);

function checkFileType(file, cb) {
  const fileType = /jpeg|jpg|png|git|webp/;
  const extName = fileType.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileType.test(file.mimetype);

  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb("Error : Image Only ! ");
  }
}

async function uploadsToFirebase(req, res, next) {
    //console.log("Uploaded Files:", req.files);
    if (!req.files || req.files.length === 0) {
      next(); // ถ้าไม่มีไฟล์ ให้ข้ามไป
    } else {
      try {
        let fileUrls = []; // เก็บ URL ของไฟล์ทั้งหมด
  
        for (const file of req.files) {
          // สร้าง path สำหรับ Firebase Storage
          const storageRef = ref(firebaseStorage, `SE-Shop/DormDeals/imagePost/${file.originalname}`); //Path Images
  
          // กำหนด metadata
          const metadata = {
            contentType: file.mimetype,
          };
  
          // อัปโหลดไฟล์ไปยัง Firebase
          const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata);
  
          // ดึง URL ของไฟล์ที่อัปโหลด
          const downloadURL = await getDownloadURL(snapshot.ref);
          fileUrls.push(downloadURL);
        }
  
        // เพิ่ม URLs ของไฟล์ไปยัง request object
        req.fileUrls = fileUrls;
        next();
      } catch (error) {
        res.status(500).json({
          message: error.message || "Something went wrong while uploading to firebase",
        });
      }
    }
  }


  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 4000000 }, //4MB
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb); //Check file exit
    },
  }).single("file");
  
  function checkFileType(file, cb) {
    const fileType = /jpeg|jpg|png|git|webp/;
    const extName = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);
  
    if (mimetype && extName) {
      return cb(null, true);
    } else {
      cb("Error:Image Only ! ");
    }
  }
  
  //upload to firebase
  async function uploadToFirebase(req,res,next){
    if(!req.file){
      // return res.status(400).json({message:"Image is required"})
      next();
    }else{
      //savelocation
    const storageRef = ref(firebaseStorage,`SE-Shop/DormDeals/imageMainCategory/${req?.file?.originalname}`);
    //file type
    const metadata = {
      contentType : req?.file?.mimetype,
    }
    try{
      //uploading..
      const snapshot = await uploadBytesResumable(storageRef,req?.file?.buffer,metadata);
      //get url from firebase
      req.file.firebaseUrl = await getDownloadURL(snapshot.ref);
      next();
    }catch(error){
      res.status(500).json({message:error.message || "Somthing wen wrong while uploading to firebase"});
    }
  
  }
    }
  

module.exports = { uploads, upload, uploadToFirebase, uploadsToFirebase };