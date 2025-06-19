import { useState, useEffect } from "react";
import mainCategoryService from "../../../services/mainCategory.service";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";

import ModalEditMainCategory from "./ModalEditMainCategory";
import ModalEditSubCategory from "./ModalEditSubCategory";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [newName, setNewName] = useState("");
  const [image, setImage] = useState(null);
  const [adding, setAdding] = useState(false);
  const [subNames, setSubNames] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSubModalOpen, setEditSubModalOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [editingImage, setEditingImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await mainCategoryService.getAllMainCategories();
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newName || !image) {
      Swal.fire("กรุณาใส่ชื่อและเลือกรูป", "", "warning");
      return;
    }

    //FormData จะส่งผ่าน HTTP request
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("file", image); // ชื่อ key file ตรงแล้ว

    setAdding(true);
    try {
      await mainCategoryService.addMainCategory(formData);
      Swal.fire("เพิ่มหมวดหมู่สำเร็จ", "", "success");
      setNewName("");
      setImage(null);
      fetchCategories();
    } catch (err) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err?.response?.data?.message || err.message,
        "error"
      );
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "หมวดหมู่จะถูกลบถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await mainCategoryService.deleteMainCategory(id);
        Swal.fire("ลบสำเร็จ", "", "success");
        fetchCategories();
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.message || "", "error");
      }
    }
  };

  const handleAddSubCategory = async (mainCategoryId) => {
    const subCategoryName = subNames[mainCategoryId];
    if (!subCategoryName) {
      Swal.fire("กรุณาใส่ชื่อหมวดย่อย", "", "warning");
      return;
    }

    try {
      await mainCategoryService.addSubCategory({
        mainCategoryId,
        subCategoryName,
      });
      Swal.fire("เพิ่มหมวดย่อยสำเร็จ", "", "success");
      setSubNames((prev) => ({ ...prev, [mainCategoryId]: "" }));
      fetchCategories();
    } catch (err) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err?.response?.data?.message || err.message,
        "error"
      );
    }
  };

  const handleEditCategory = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
    setEditingImage(cat.image);
    setIsEditModalOpen(true);
  };


  const handleUpdateCategory = async () => {
    if (!editingName || !editingId) return;

    //  สร้างอ็อบเจกต์ FormData
    const formData = new FormData();
    formData.append("name", editingName); // บรรทัดนี้เพิ่มชื่อหมวดหมู่ที่แก้ไขแล้ว
    if (editingImage && typeof editingImage !== "string") {
      formData.append("file", editingImage); // บรรทัดนี้จะเพิ่มไฟล์รูปภาพใหม่
    }

    try {
      await mainCategoryService.updateMainCategory(editingId, formData);
      Swal.fire("อัปเดตหมวดหมู่สำเร็จ", "", "success");
      setEditingId(null);
      setEditingName("");
      setEditingImage(null);
      setIsEditModalOpen(false);
      fetchCategories();
    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", err.message, "error");
    }
  };

  const handleEditSubCategory = (sub) => {
    setSelectedSub(sub);
    setEditSubModalOpen(true);
  };

  const handleUpdateSubCategory = async (newName) => {
    if (!selectedSub || !newName) return;
    try {
      // ส่ง _id ของหมวดหมู่ย่อยที่เลือกและอ็อบ
      await mainCategoryService.updateSubCategory(selectedSub._id, {
        subCategoryName: newName,
      });
      Swal.fire("อัปเดตหมวดย่อยสำเร็จ", "", "success");
      setEditSubModalOpen(false);
      setSelectedSub(null);
      fetchCategories();
    } catch (err) {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        err?.response?.data?.message || err.message,
        "error"
      );
    }
  };

  const handleDeleteSubCategory = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "หมวดย่อยจะถูกลบถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await mainCategoryService.deleteSubCategory(id);
        Swal.fire("ลบสำเร็จ", "", "success");
        setTimeout(() => {
          fetchCategories();
        }, 500);
      } catch (err) {
        Swal.fire("เกิดข้อผิดพลาด", err.message, "error");
      }
    }
  };

  const toggleExpand = (index) => {
    setExpanded(index === expanded ? null : index);
  };

  return (
    <div className="section-container-add-products pt-22 w-full max-w-[846px] mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">จัดการหมวดหมู่สินค้า</h2>

      <div className="mb-6 flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="ชื่อหมวดหมู่ใหม่"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="file-input file-input-bordered"
        />
        <button
          onClick={handleAddCategory}
          className="btn btn-primary"
          disabled={adding}
        >
          {adding ? "กำลังเพิ่ม..." : "เพิ่มหมวดหมู่"}
        </button>
      </div>

      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="w-20 h-20 object-cover rounded mb-4"
        />
      )}

      {loading ? (
        <div className="text-center">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat, index) => (
            <div
              key={cat._id}
              className=" rounded-lg border border-gray-500 shadow px-4 py-3"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <span className="font-medium text-lg">{cat.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  <button
                    onClick={() => handleEditCategory(cat)}
                    className="flex items-center gap-1 text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded shadow-sm transition duration-200"
                  >
                    <FiEdit className="text-base" />
                    แก้ไขหมวดหมู่
                  </button>

                  <button
                    onClick={() => toggleExpand(index)}
                    className="flex items-center gap-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded shadow-sm transition duration-200"
                  >
                    <FaPlus className="text-base" />
                    เพิ่มหมวดย่อย
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat._id)}
                    className="flex items-center gap-1 text-sm bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded shadow-sm transition duration-200"
                  >
                    <FaTrash className="text-base" />
                    ลบหมวดหมู่
                  </button>
                </div>
              </div>

              {expanded === index && (
                <div className="mt-4 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ชื่อหมวดย่อย"
                      value={subNames[cat._id] || ""}
                      onChange={(e) =>
                        setSubNames((prev) => ({
                          ...prev,
                          [cat._id]: e.target.value,
                        }))
                      }
                      className="input input-bordered w-full"
                    />
                    <button
                      onClick={() => handleAddSubCategory(cat._id)}
                      className="btn btn-outline btn-primary"
                    >
                      เพิ่ม
                    </button>
                  </div>

                  <div className="text-sm ">
                    หมวดย่อย:
                    {cat.subCategories?.length > 0 ? (
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {cat.subCategories.map((sub) => (
                          <li
                            key={sub._id}
                            className="flex justify-between items-center"
                          >
                            <span>{sub.subCategoryName}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSubCategory(sub)}
                                className="text-yellow-600 hover:underline text-sm"
                              >
                                แก้ไข
                              </button>
                              <button
                                onClick={() => handleDeleteSubCategory(sub._id)}
                                className="text-red-600 hover:underline text-sm"
                              >
                                ลบ
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="italic text-gray-400">
                        ไม่มีหมวดย่อย
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ModalEditMainCategory
        isOpen={isEditModalOpen}
        name={editingName}
        image={editingImage}
        onChangeName={setEditingName}
        onChangeImage={setEditingImage}
        onConfirm={handleUpdateCategory}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingId(null);
          setEditingName("");
          setEditingImage(null);
        }}
      />

      <ModalEditSubCategory
        isOpen={editSubModalOpen}
        subCategory={selectedSub}
        onClose={() => {
          setEditSubModalOpen(false);
          setSelectedSub(null);
        }}
        onConfirm={handleUpdateSubCategory}
      />
    </div>
  );
};

export default ManageCategories;
