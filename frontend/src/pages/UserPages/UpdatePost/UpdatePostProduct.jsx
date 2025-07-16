import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PostService from "../../../services/postproduct.service";
import CategorieService from "../../../services/categorie.service";
import { useNavigate, useParams } from "react-router";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import MainCategoryService from "../../../services/mainCategory.service";
import SubCategoryService from "../../../services/subCategory.service";

const UpdatePostProduct = () => {
  const [categories, setCategories] = useState([]); //	main categories ทั้งหมด	ใช้เพื่อแสดงหมวดหมู่หลักให้เลือก
  const [existingImages, setExistingImages] = useState([]); //	รูปภาพเดิมของโพสต์	ใช้สำหรับแสดงให้ผู้ใช้ดูรูปเก่า

  const [subCategories, setSubCategories] = useState([]); //หมวดหมู่ย่อยของหมวดที่เลือก	เปลี่ยนตาม category
  const [tempPost, setTempPost] = useState(null);
  const [postProduct, setPostProduct] = useState({ //	เก็บข้อมูลของโพสต์ที่แก้ไขอยู่	เป็น object รวมค่าจาก input form
    postType: "",
    productName: "",
    category: "",
    files: [],
    price: "",
    description: "",
    condition: "",
    postPaymentType: "",
    subcategory: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
  const fetchInitial = async () => {
    try {
      // ดึงข้อมูลโพสต์ที่จะแก้ไข และหมวดหมู่หลักทั้งหมด ใช้ Promise.all เพื่อรอทั้งสองคำขอดึงข้อมูลพร้อมกัน
      const [postRes, mainRes] = await Promise.all([ //เมื่อ component โหลดหรือ id เปลี่ยนให่ไป ไปโหลด รายละเอียดโพสต์
        
        
        PostService.getPostById(id),
        MainCategoryService.getAllMainCategories(),
      ]);

    

      //แปลง category และ subcategory ID ให้อยู่ในรูปเเบบ string
      //เพื่อให้แน่ใจว่า category/subcategory ที่ได้จาก API เป็น string(บางครั้งมันอาจมาเป็น object เช่น { _id: "123" } หรือแค่ "123")
      const categoryId = postRes.category?._id?.toString() || postRes.category?.toString();
      const subcategoryId = postRes.subcategory?._id?.toString() || postRes.subcategory?.toString();

      //เก็บข้อมูลหมวดหมู่หลัก (main category) ทั้งหมดลง state เพื่อใช้ใน dropdown
      const categoriesData = mainRes.data;
      setCategories(categoriesData);

      // หา category ที่ตรงกับ ID ที่ได้จากโพสต์
      // และดึง แล้วดึง หมวดหมู่ย่อย (subCategories) ที่อยู่ภายใต้ main category นั้นออกมา
      const matchedCategory = categoriesData.find(c => c._id.toString() === categoryId);
      let matchedSubCategories = matchedCategory?.subCategories || [];


      //  ถ้ายังไม่มี subCategories ให้ดึง subcategory เดิมแยกมาเพิ่มลงไป
      if (!matchedSubCategories.length && subcategoryId) {
        try {
          const subRes = await MainCategoryService.getSubCategoryById(subcategoryId);
          matchedSubCategories = [subRes.data]; // แปะเพิ่มเป็น array เดียว
        } catch (err) {
          console.warn("ไม่พบ subcategory นี้:", subcategoryId);
          //ถ้าไม่เจอ ให้แสดง warning  ใน console  ป้องกันไม่ให้ dropdown ของหมวดหมู่ย่อยว่างเปล่า หรือทำให้ฟอร์มเสีย
        }
      }

      //เอาหมวดหมู่ย่อยที่ค้นเจอหรือโหลดมาให้ไปเก็บไว้ใน state subCategories
      setSubCategories(matchedSubCategories);

      // ตั้งค่า postProduct ด้วยข้อมูลที่ได้จากโพสต์
      setPostProduct({
        postType: postRes.postType,
        productName: postRes.productName,
        category: categoryId,
        subcategory: subcategoryId,
        price: postRes.price,
        description: postRes.description,
        condition: postRes.condition,
        postPaymentType: postRes.postPaymentType,
        files: [],
        modNote: postRes.modNote || "", 
      });
      //เอาค่าจากโพสต์ที่โหลดมา (postRes) → ใส่ใน state postProduct  files: [] เพราะยังไม่ได้อัปโหลดไฟล์ใหม่
      //modNote คือโน้ตจากแอดมิน เพื่อแสดงเหตุผลที่โพสต์ต้องแก้ไขได้ถูกจุด

      setExistingImages(postRes.images || []);
      //รูปภาพที่โพสต์นี้เคยมีให้ เก็บไว้ใน existingImages
      //ใช้แสดงรูปเดิมใน UI และส่งไปกับการอัปเดต 
    } catch (err) {
      console.error("โหลดข้อมูลล้มเหลว ", err);
    }
  };

  if (id) fetchInitial();
}, [id]);



  //ตรวจสอบหมวดหมู่ย่อยทุกครั้งที่เปลี่ยน category
  useEffect(() => {
    if (!postProduct.category || categories.length === 0) return;

    // เมื่อเปลี่ยนหมวดหมู่หลัก ให้ดึงหมวดหมู่ย่อยที่ตรงกับหมวดหลักนั้น
    const matched = categories.find(
      (c) => c._id.toString() === postProduct.category
    );
    // matched จะเป็น category object ที่ตรงกับ postProduct.category
    const subs = matched?.subCategories || [];
    // ถ้าไม่พบหมวดหมู่ย่อย ให้ใช้ array ว่าง
    setSubCategories(subs);


    // ถ้าหมวดหมู่ย่อยเดิมไม่ตรงกับที่มีอยู่ ก็ล้าง
    const stillValid = subs.some(
      (s) => s._id?.toString() === postProduct.subcategory
    );
    // ตรวจสอบว่า subcategory ที่เลือกยังมีอยู่ในหมวดหมู่ย่อยใหม่หรือไม่
   
    if (!stillValid) {
      setPostProduct((prev) => ({ ...prev, subcategory: "" }));
    }
    // ถ้าไม่ตรง ก็ล้างค่า subcategory ใน postProduct
  }, [postProduct.category]);


  // ฟังก์ชันจัดการการเปลี่ยนแปลงของ input ใช้สำหรับอัปเดตค่าใน state postProduct
  const handleChange = (e) => {
    // ใช้ e.target เพื่อดึงค่าจาก input ที่เปลี่ยนแปลง
    const { name, value, files } = e.target;
    // ถ้าเป็น input ที่มีไฟล์ (เช่น รูปภาพ) จะต้องจัดการแยกต่างหาก
    if (name === "files") {

      const selected = Array.from(files);
      // แปลงไฟล์ที่เลือกเป็น array เพื่อให้สามารถจัดการได้ง่าย
      setPostProduct((prev) => ({
        ...prev,
        files: [...prev.files, ...selected].slice(0, 4),
        // อัปเดตไฟล์ใหม่ที่เลือกเข้าไปใน state postProduct  ถ้าไฟล์ที่เลือกมีมากกว่า 4 ไฟล์ จะตัดให้เหลือแค่ 4 ไฟล์
      }));

    } else {
      //ถ้าเป็น field ปกติอัปเดตค่าตาม name ของ input
      setPostProduct((prev) => ({ ...prev, [name]: value })); 

    }
  };

  //ลบรูปภาพออกจาก state 
  const handleRemoveImage = (index) => {
    const updated = [...postProduct.files]; // 1. clone array เดิม เพื่อไม่แก้ไขโดยตรง
    updated.splice(index, 1);               //ลบรูปตาม index ที่ส่งเข้ามา
    setPostProduct((prev) => ({ ...prev, files: updated })); //อัปเดต state postProduct
  };


  const handleCancel = () => {
  Swal.fire({
    title: "แน่ใจหรือไม่?",
    text: "การเปลี่ยนแปลงทั้งหมดจะไม่ถูกบันทึก",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่, ยกเลิก",
    cancelButtonText: "ไม่, กลับไปแก้ไข",
   didOpen: () => {
  const confirmButton = document.querySelector(".swal2-confirm");
  if (confirmButton) {
    confirmButton.setAttribute("data-test", "swal-post-confirm-cancelupdate");
  }
}

  }).then((result) => {
    if (result.isConfirmed) {
   Swal.fire({
        title: "คุณได้ยกเลิกการแก้ไขโพสต์แล้ว",
        text: "โพสต์ของคุณจะไม่ถูกบันทึก",
        icon: "success",
        timer: 2500,
        showConfirmButton: false,
        didOpen: () => {
        const title = document.querySelector(".swal2-title");
        if (title) {
          title.setAttribute("data-test", "swal-post-cancel-update-success"); 
        }
      },
      }).then(() =>{
           navigate("/ManagePostStatus");
      })
     
    }
  });
};

  
  // ฟังก์ชันจัดการการส่งฟอร์ม เมื่อผู้ใช้กดปุ่ม "ยืนยันการโพสต์"
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ตรวจสอบว่ามีการเลือกหมวดหมู่หลักหรือไม่
      //FormData เพื่อส่งข้อมูลแบบ multipart/form-data
      const data = new FormData();
      [
        "postType",
        "productName",
        "category",
        "subcategory",
        "price",
        "description",
        "condition",
        "postPaymentType",
      ].forEach((key) => data.set(key, postProduct[key]));
      // ใช้ forEach เพื่อเพิ่มค่าจากลงในfieldต่างๆใน postProduct ลงใน FormData 

      //แปลง array existingImages เป็น JSON string เพื่อให้ backend จัดการได้ง่าย (เช่น รู้ว่าไม่ต้องลบภาพเหล่านี้)
      data.set("existingImages", JSON.stringify(existingImages));

      // ถ้ามีไฟล์ใหม่ที่อัปโหลด ให้เพิ่มเข้าไปใน FormData ใช้ .append() สำหรับแนบหลายไฟล์เข้า FormData
      postProduct.files.forEach((file) => data.append("files", file));

      // เรียก API เพื่ออัปเดตโพสต์ ส่งข้อมูลไปยัง PostService โดยใช้ ID ของโพสต์
      const res = await PostService.updatePostProduct(id, data);
      if (res.status === 200) {
        Swal.fire({
          title: "อัปเดตโพสต์สำเร็จ!",
          text: "โพสต์ของคุณจะถูกส่งตรวจสอบอีกครั้ง",
          icon: "success",
          timer: 2500,
           didOpen: () => {
        const title = document.querySelector(".swal2-title");
        if (title) {
          title.setAttribute("data-test", "swal-post-update-success"); 
        }
      },
        });
        navigate("/");
      } else {
        throw new Error();
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่",
        icon: "error",
      });
    }
  };

  return (
    //แสดงฟอร์มทั้งหมดใน <form onSubmit={handleSubmit}>
    //ใช้ postProduct เป็น state หลักในการเก็บค่าจาก input ต่าง ๆ
    <div className="section-container-add-products pt-16">      
      <form className="mb-4" onSubmit={handleSubmit}> 
        <h2 data-test="header-edit-productdetails" className="bg-card w-full pl-16  h-20 text-xl flex items-center">
          รายละเอียดสินค้า
        </h2>
        {/* เลือกข้อเสนอ */}

        <div className="mt-2  ">
          
          {postProduct.modNote && (
            <div className="bg-red-200 text-red-800 px-7 py-4 rounded-lg mb-4">
              เหตุผลสำหรับการแก้ไข: {postProduct.modNote}
            </div>
          )}
          

          <h2 className="text-xl font-semibold text-black">เลือกข้อเสนอ</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Want To Sell */}
            <input
              type="radio"
              id="sell"
              name="postType"
              value="WTS"
              className="hidden"
              onChange={handleChange}
            />
            
            <label
              htmlFor="sell"
              className={`cursor-pointer text-center transition-all duration-300 flex items-center justify-center rounded-xl text-base p-4 w-full sm:w-48 h-14 border-2 mt-2 ${
                postProduct.postType === "WTS"
                  ? "bg-vivid text-white border-vivid shadow-md"
                  : "text-vivid border-vivid hover:bg-vivid hover:text-white"
              }`}
            >
              Want To Sell
            </label>

            {/* Want To Buy */}
            <input
              type="radio"
              id="buy"
              name="postType"
              value="WTB"
              className="hidden"
              onChange={handleChange}
            />
            {/*ใช้ handleChange() เป็น handler หลักในการจัดการกับ input*/  }
            <label
              htmlFor="buy"
              className={`cursor-pointer text-center transition-all duration-300 flex items-center justify-center rounded-xl text-base p-4 w-full sm:w-48 h-14 border-2 mt-2 ${
                postProduct.postType === "WTB"
                  ? "bg-vivid text-white border-vivid shadow-md"
                  : "text-vivid border-vivid hover:bg-vivid hover:text-white"
              }`}
            >
              Want To Buy
            </label>
          </div>

          {/* ชื่อสินค้า */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-black">ชื่อสินค้า</h2>
            <input
              id="productName"
              name="productName"
              placeholder="กรอกชื่อสินค้า"
              required
              className="mt-2 p-4 text-base w-full border-gray-400 rounded-xl shadow-sm"
              value={postProduct.productName}
              onChange={handleChange}
            />
          </div>

          {/* เลือกหมวดหมู่ให้ตรงกับสินค้า */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-black">
              เลือกหมวดหมู่หลัก
            </h2>
            <select
              className="select select-xl xl:w-100 border-gray-400 rounded-xl shadow-sm mt-2"
              name="category"
              value={postProduct.category}
              onChange={handleChange}
            >
              <option value="default">เลือกหมวดหมู่</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* เลือกซับหมวดหมู่ */}
          {subCategories.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-black">
                เลือกหมวดหมู่ย่อย
              </h2>
              <select
                name="subcategory"
                value={postProduct.subcategory || ""}
                onChange={handleChange}
                className="select select-xl xl:w-100 border-gray-400 rounded-xl shadow-sm mt-2"
              >
                <option value="">เลือกหมวดหมู่ย่อย</option>
                {/* subCategories คือ array ของหมวดย่อย (ถูก set มาจาก useEffect) ใช้ .map() เพื่อสร้าง <option> สำหรับแต่ละตัว */}
                {subCategories.map((sub, index) => ( 
                  <option
                    key={sub._id?.toString() || sub.subCategoryName} //key และ value ใช้ _id หากมี ถ้าไม่มีก็ fallback เป็น subCategoryName
                    value={sub._id?.toString() || sub.subCategoryName}
                  >
                    {sub.subCategoryName} {/* sub.subCategoryName คือชื่อหมวดหมู่ที่แสดงบน dropdown */}
                  </option>
                ))}
              </select>
            </div>
          )}

          
          {/* เลือกรูปภาพ */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-black">เลือกรูปภาพ</h2>

            
            <div className="pt-2 flex flex-wrap gap-4">
              {/* ปุ่มเพิ่มรูปภาพ */}
              <label className="w-40 h-40 border-dashed border-1 border-black rounded-md cursor-pointer flex flex-col justify-center items-center text-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <AiOutlineCloudUpload className="w-24 h-12" />+ เพิ่มรูปภาพ
                <span className="font-light text-sm pt-2 text-black/50">
                  สูงสุด 4 ภาพ
                </span>
                <input
                  className="hidden"
                  type="file"
                  name="files"
                  multiple
                  onChange={handleChange}
                />
              </label>

              {/* Preview รูปภาพเก่า + ใหม่ */}
              {/* มีเงื่อนไขแสดงรูปภาพเก่า (existingImages) และรูปภาพใหม่ (postProduct.files) */}
              {[...existingImages, ...postProduct.files].map((img, index) => (
                <div key={index} className="relative w-40 h-40">
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:text-red-500"
                    onClick={() => {
                      // เหลือก index: ถ้าเป็น string ถ้า img เป็น string ให้ลบออกจาก existingImages
                      if (typeof img === "string") {

                        const updated = [...existingImages];
                        
                        updated.splice(index, 1); // ลบภาพตาม index
                        setExistingImages(updated);// อัปเดต state
                      } else {
                        const updated = [...postProduct.files];
                        // ถ้าเป็นไฟล์ใหม่ ให้ลบออกจาก postProduct.files
                        updated.splice(index - existingImages.length, 1);
                        
                        // ใช้ index - existingImages.length เพื่อให้ลบถูกต้อง
                        setPostProduct((prev) => ({ ...prev, files: updated }));
                      // อัปเดต state postProduct.files
                      }
                    }}
                  >
                    <RxCross2 />
                  </button>
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img) // URL.createObjectURL() ใช้แสดง preview ของ File object ชั่วคราว
                    }
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ราคาสินค้า */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-black">
              ราคาสินค้า (บาท)
            </h2>
            <input
              id="price"
              name="price"
              min="0"
              data-test="edit-price"
              className="mt-1 p-4 text-base xl:w-100 border-gray-400 rounded-xl shadow-sm"
              type="number"
              placeholder="กรอกราคา"
              value={postProduct.price}
              onChange={handleChange}
            />
          </div>

          {/* รายละเอียดสินค้า */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-black">
              รายละเอียดสินค้า
            </h2>
            <textarea
              id="description"
              name="description"
              required
              className="mt-1 p-4 h-50 text-base w-full border-gray-400 rounded-xl shadow-sm"
              type="text"
              placeholder=" กรุณากรอกข้อมูล เช่น สภาพสินค้า, ยี่ห้อ, รุ่น, ขนาด หรือข้อมูลสำคัญอื่น ๆ เพื่อให้ผู้ซื้อเข้าใจชัดเจน."
              value={postProduct.description}
              onChange={handleChange}
            />
          </div>

          {/* สภาพสินค้า */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-black">สภาพสินค้า</h2>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {/* มือสองสภาพดี */}
              <input
                type="radio"
                id="UsedGood"
                name="condition"
                value="มือสองสภาพดี"
                className="hidden"
                onChange={handleChange}
              />
              <label
                htmlFor="UsedGood"
                className={`cursor-pointer text-center transition-all duration-300 flex items-center justify-center rounded-xl text-base p-4 w-full sm:w-48 h-14 border-2 mt-2 ${
                  postProduct.condition === "มือสองสภาพดี"
                    ? "bg-vivid text-white border-vivid shadow-md"
                    : "text-vivid border-vivid hover:bg-vivid hover:text-white"
                }`}
              >
                มือสองสภาพดี
              </label>

              {/* มือสองพอใช้ */}
              <input
                type="radio"
                id="UsedAcceptable"
                name="condition"
                value="มือสองสภาพพอใช้"
                className="hidden"
                onChange={handleChange}
              />
              <label
                htmlFor="UsedAcceptable"
                className={`cursor-pointer text-center transition-all duration-300 flex items-center justify-center rounded-xl text-base p-4 w-full sm:w-48 h-14 border-2 mt-2 ${
                  postProduct.condition === "มือสองสภาพพอใช้"
                    ? "bg-vivid text-white border-vivid shadow-md"
                    : "text-vivid border-vivid hover:bg-vivid hover:text-white"
                }`}
              >
                มือสองพอใช้
              </label>

              {/* เลือกประเภทประกาศโพสต์ */}
              <div className="mt-8 ">
                <h2 className="text-xl font-semibold text-black ">
                  เลือกประเภทประกาศโพสต์
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-colors ${
                      postProduct.postPaymentType === "Free"
                        ? "bg-vivid text-white"
                        : "border-vivid hover:bg-vivid hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      id="Free"
                      name="postPaymentType"
                      value="Free"
                      className="hidden"
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="Free"
                      className="cursor-pointer text-center w-full"
                    >
                      <p className="text-base">&#x2022; โพสต์โฆษณาฟรี</p>
                      <p className="text-base">&#x2022; ไม่มีค่าธรรมเนียมใดๆ</p>
                      <span className="block text-xl font-bold mt-2">Free</span>
                    </label>
                  </div>

                  <div
                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl transition-colors ${
                      postProduct.postPaymentType === "Paid"
                        ? "bg-vivid text-white"
                        : "border-vivid hover:bg-vivid hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      id="Paid"
                      name="postPaymentType"
                      value="Paid"
                      className="hidden"
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="Paid"
                      className="cursor-pointer text-center w-full"
                    >
                      <p className="text-base">
                        &#x2022; เพิ่มการโฆษณาให้สินค้ามองเห็นก่อนใคร
                      </p>
                      <p className="text-base">&#x2022; คนเห็นเยอะกว่า</p>
                      <span className="block text-xl font-bold mt-2">
                        7 วัน เป็นเงิน 110฿
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ปุ่ม submit */}
              <div  className="mt-6 flex justify-center items-center w-full">
                <a data-test="submit-cancel-update-post"  onClick={handleCancel} className="cursor-pointer transition-all duration-300 text-red-500 items-center justify-center flex border-red-500 hover:bg-red-500 hover:text-white border-2 rounded-xl text-lg w-48 h-18 m-2">
                  ยกเลิก
                </a>
                <button
                  type="submit"
                  data-test="submit-update-post"
                  className="cursor-pointer transition-all duration-300 items-center justify-center flex text-vivid hover:bg-vivid border-vivid hover:text-white border-2 rounded-xl text-lg w-48 h-18 m-2"
                >
                  ยืนยันการโพสต์
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdatePostProduct;
