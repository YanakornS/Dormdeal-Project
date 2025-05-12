import { useState, useEffect } from "react";
import CategorieService from "../../../services/categorie.service";
import { FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [newName, setNewName] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await CategorieService.getAllCategorie();
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

    const formData = new FormData();
    formData.append("name", newName);
    formData.append("image", image);

    try {
      await CategorieService.addCategory(formData);
      Swal.fire("เพิ่มหมวดหมู่สำเร็จ", "", "success");
      setNewName("");
      setImage(null);
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      Swal.fire("เกิดข้อผิดพลาด", err.message || "", "error");
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
        await CategorieService.deleteCategory(id);
        Swal.fire("ลบสำเร็จ", "", "success");
        fetchCategories();
      } catch (err) {
        console.error("Error deleting:", err);
        Swal.fire("เกิดข้อผิดพลาด", err.message || "", "error");
      }
    }
  };

  const toggleExpand = (index) => {
    setExpanded(index === expanded ? null : index);
  };

  return (
    <div className="w-full max-w-[846px] mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">จัดการหมวดหมู่สินค้า</h2>

      {/* ฟอร์มเพิ่มหมวดหมู่ */}
      <div className="mb-6 space-y-2">
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
          className="file-input file-input-bordered w-full"
        />
        <button onClick={handleAddCategory} className="btn btn-primary w-full">
          เพิ่มหมวดหมู่
        </button>
      </div>

      {/* รายการหมวดหมู่ */}
      {loading ? (
        <div className="text-center">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat, index) => (
            <div
              key={cat._id}
              className="bg-white rounded-lg border border-gray-200 shadow px-4 py-3"
            >
              <div
                onClick={() => toggleExpand(index)}
                className="flex items-center justify-between flex-wrap gap-4 cursor-pointer"
              >
                <span className="font-medium text-lg">{cat.name}</span>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </div>

              {expanded === index && (
                <div className="mt-3 px-2 space-y-3">
                  <p className="text-sm text-gray-500">ยังไม่มีหมวดหมู่ย่อย</p>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded">
                      <FaPlus /> เพิ่มหมวดย่อย
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="flex items-center gap-1 text-sm bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded"
                    >
                      <FaTrash /> ลบหมวดหมู่
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
