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
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [subCategories, setSubCategories] = useState([]);
  const [tempPost, setTempPost] = useState(null);
  const [postProduct, setPostProduct] = useState({
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
      const [postRes, mainRes] = await Promise.all([
        PostService.getPostById(id),
        MainCategoryService.getAllMainCategories(),
      ]);

      const categoryId = postRes.category?._id?.toString() || postRes.category?.toString();
      const subcategoryId = postRes.subcategory?._id?.toString() || postRes.subcategory?.toString();
      const categoriesData = mainRes.data;

      setCategories(categoriesData);

      const matchedCategory = categoriesData.find(c => c._id.toString() === categoryId);
      let matchedSubCategories = matchedCategory?.subCategories || [];

      // ✅ ถ้ายังไม่มี subCategories ให้ดึง subcategory เดิมแยกมาเพิ่มลงไป
      if (!matchedSubCategories.length && subcategoryId) {
        try {
          const subRes = await MainCategoryService.getSubCategoryById(subcategoryId);
          matchedSubCategories = [subRes.data]; // แปะเพิ่มเป็น array เดียว
        } catch (err) {
          console.warn("ไม่พบ subcategory นี้:", subcategoryId);
        }
      }

      setSubCategories(matchedSubCategories);

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

      setExistingImages(postRes.images || []);
    } catch (err) {
      console.error("โหลดข้อมูลล้มเหลว ", err);
    }
  };

  if (id) fetchInitial();
}, [id]);

  useEffect(() => {
    if (!postProduct.category || categories.length === 0) return;

    const matched = categories.find(
      (c) => c._id.toString() === postProduct.category
    );
    const subs = matched?.subCategories || [];
    setSubCategories(subs);

    // ถ้าหมวดหมู่ย่อยเดิมไม่ตรงกับที่มีอยู่ ก็ล้าง
    const stillValid = subs.some(
      (s) => s._id?.toString() === postProduct.subcategory
    );
    if (!stillValid) {
      setPostProduct((prev) => ({ ...prev, subcategory: "" }));
    }
  }, [postProduct.category]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      const selected = Array.from(files);
      setPostProduct((prev) => ({
        ...prev,
        files: [...prev.files, ...selected].slice(0, 4),
      }));
    } else {
      setPostProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (index) => {
    const updated = [...postProduct.files];
    updated.splice(index, 1);
    setPostProduct((prev) => ({ ...prev, files: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      data.set("existingImages", JSON.stringify(existingImages));
      postProduct.files.forEach((file) => data.append("files", file));

      const res = await PostService.updatePostProduct(id, data);
      if (res.status === 200) {
        Swal.fire({
          title: "อัปเดตโพสต์สำเร็จ!",
          text: "โพสต์ของคุณจะถูกส่งตรวจสอบอีกครั้ง",
          icon: "success",
          timer: 2500,
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
    <div className="section-container-add-products pt-16">
      <form className="mb-4" onSubmit={handleSubmit}>
        <h2 className="bg-card w-full pl-16  h-20 text-xl flex items-center">
          รายละเอียดสินค้า
        </h2>
        {/* เลือกข้อเสนอ */}
        <div className="mt-2  shadow-md">
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
                {subCategories.map((sub, index) => (
                  <option
                    key={sub._id?.toString() || sub.subCategoryName}
                    value={sub._id?.toString() || sub.subCategoryName}
                  >
                    {sub.subCategoryName}
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
              {[...existingImages, ...postProduct.files].map((img, index) => (
                <div key={index} className="relative w-40 h-40">
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:text-red-500"
                    onClick={() => {
                      // ☑⃣ เหลือก index: ถ้าเป็น string => URL / object => file
                      if (typeof img === "string") {
                        const updated = [...existingImages];
                        updated.splice(index, 1);
                        setExistingImages(updated);
                      } else {
                        const updated = [...postProduct.files];
                        updated.splice(index - existingImages.length, 1);
                        setPostProduct((prev) => ({ ...prev, files: updated }));
                      }
                    }}
                  >
                    <RxCross2 />
                  </button>
                  <img
                    src={
                      typeof img === "string" ? img : URL.createObjectURL(img)
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
              required
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
              <div className="mt-6 flex justify-center items-center w-full">
                <a className="cursor-pointer transition-all duration-300 text-red-500 items-center justify-center flex border-red-500 hover:bg-red-500 hover:text-white border-2 rounded-xl text-lg w-48 h-18 m-2">
                  ยกเลิก
                </a>
                <button
                  type="submit"
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
