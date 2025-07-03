import { useState, useEffect } from "react";
import mainCategoryService from "../../../services/mainCategory.service";
import { FaPlus, FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
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
      toast.error("โหลดข้อมูลหมวดหมู่ล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newName || !image) {
      toast.error("กรุณาใส่ชื่อและเลือกรูป");
      return;
    }

    const formData = new FormData();
    formData.append("name", newName);
    formData.append("file", image);

    setAdding(true);
    try {
      await mainCategoryService.addMainCategory(formData);
      toast.success("เพิ่มหมวดหมู่สำเร็จ");
      setNewName("");
      setImage(null);
      fetchCategories();
      window.location.reload()
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "หมวดหมู่หลักจะถูกลบถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await mainCategoryService.deleteMainCategory(id);
        toast.success("ลบหมวดหมู่หลักสำเร็จ");
        fetchCategories();
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
      }
    }
  };

  const handleAddSubCategory = async (mainCategoryId) => {
    const subCategoryName = subNames[mainCategoryId];
    if (!subCategoryName) {
      toast.error("กรุณาใส่ชื่อหมวดหมู่ย่อย");
      return;
    }

    try {
      await mainCategoryService.addSubCategory({
        mainCategoryId,
        subCategoryName,
      });
      toast.success("เพิ่มหมวดหมู่ย่อยสำเร็จ");
      setSubNames((prev) => ({ ...prev, [mainCategoryId]: "" }));
      fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
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

    const formData = new FormData();
    formData.append("name", editingName);
    if (editingImage && typeof editingImage !== "string") {
      formData.append("file", editingImage);
    }

    try {
      await mainCategoryService.updateMainCategory(editingId, formData);
      toast.success("อัปเดตหมวดหมู่หลักสำเร็จ");
      setEditingId(null);
      setEditingName("");
      setEditingImage(null);
      setIsEditModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditSubCategory = (sub) => {
    setSelectedSub(sub);
    setEditSubModalOpen(true);
  };

  const handleUpdateSubCategory = async (newName) => {
    if (!selectedSub || !newName) return;
    try {
      await mainCategoryService.updateSubCategory(selectedSub._id, {
        subCategoryName: newName,
      });
      toast.success("อัปเดตหมวดหมู่ย่อยสำเร็จ");
      setEditSubModalOpen(false);
      setSelectedSub(null);
      fetchCategories();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    const result = await Swal.fire({
      title: "ยืนยันการลบ?",
      text: "หมวดหมู่ย่อยจะถูกลบถาวร",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        await mainCategoryService.deleteSubCategory(id);
        toast.success("ลบหมวดหมู่ย่อยสำเร็จ");
        fetchCategories();
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
      }
    }
  };

  const toggleExpand = (index) => {
    setExpanded(index === expanded ? null : index);
  };
  return (
    <div className="section-container-add-products pt-22 w-full max-w-[846px] mx-auto px-4 py-6">
      <div className="fixed top-0 right-0 w-auto z-50 p-4">
        <Toaster position="top-center	" />
      </div>
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
