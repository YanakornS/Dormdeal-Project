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

  const [editMainState, setEditMainState] = useState({
    isOpen: false,
    id: null,
    name: "",
    image: null,
  });
 
  const [editSubState, setEditSubState] = useState({
    isOpen: false,
    selectedSub: null,
  });

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
      didOpen: () => {
      Swal.getConfirmButton().setAttribute("data-test", "swal-confirm-delete");
      //Swal.getCancelButton().setAttribute("data-test", "swal-cancel-delete");
    },
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

  const handleOpenEditMain = (cat) => {
    setEditMainState({
      isOpen: true,
      id: cat._id,
      name: cat.name,
      image: cat.image,
    });
  };

  const handleCloseEditMain = () => {
    setEditMainState({
      isOpen: false,
      id: null,
      name: "",
      image: null,
    });
  };

  const handleUpdateMainCategory = async () => {
    const { id, name, image } = editMainState;
    if (!name || !id) return;

    const formData = new FormData();
    formData.append("name", name);
    //มีการเลือกไฟล์รูปภาพใหม่หรือไม่
    if (image && typeof image !== "string") {
      formData.append("file", image);
    }

    try {
      await mainCategoryService.updateMainCategory(id, formData);
      toast.success("อัปเดตหมวดหมู่หลักสำเร็จ");
      handleCloseEditMain();
      fetchCategories();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleOpenEditSub = (sub) => {
    setEditSubState({
      isOpen: true,
      selectedSub: sub,
    });
  };

  const handleCloseEditSub = () => {
    setEditSubState({
      isOpen: false,
      selectedSub: null,
    });
  };

  const handleUpdateSubCategory = async (newName) => {
    const { selectedSub } = editSubState;
    if (!selectedSub || !newName) return;
    try {
      await mainCategoryService.updateSubCategory(selectedSub._id, {
        subCategoryName: newName,
      });
      toast.success("อัปเดตหมวดหมู่ย่อยสำเร็จ");
      handleCloseEditSub();
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
        <Toaster position="top-center " />
      </div>
      <h2 data-test="modmenu-link-categories" className="text-2xl font-bold mb-6">
  จัดการหมวดหมู่สินค้า
</h2>

      <div className="mb-6 flex flex-col md:flex-row items-center gap-2">
        <input
          data-test="input-new-main-category"
          type="text"
          placeholder="ชื่อหมวดหมู่ใหม่"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          data-test="input-new-main-category-image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="file-input file-input-bordered"
        />
        <button
          data-test="button-add-main-category"
          onClick={handleAddCategory}
          className="btn btn-primary"
          disabled={adding}
        >
          {adding ? "กำลังเพิ่ม..." : "เพิ่มหมวดหมู่"}
        </button>
      </div>

      {image && (
        <img
          data-test="preview-main-category-image"
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
              data-test={`main-category-${cat._id}`}
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
                    data-test={`edit-main-category-${cat._id}`}
                    onClick={() => handleOpenEditMain(cat)}
                    className="flex items-center gap-1 text-sm bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded shadow-sm transition duration-200"
                  >
                    <FiEdit className="text-base" />
                    แก้ไขหมวดหมู่
                  </button>

                  <button
                    data-test={`add-sub-category-toggle-${cat._id}`}
                    onClick={() => toggleExpand(index)}
                    className="flex items-center gap-1 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded shadow-sm transition duration-200"
                  >
                    <FaPlus className="text-base" />
                    เพิ่มหมวดย่อย
                  </button>
                  <button
                    data-test={`delete-main-category-${cat._id}`}
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
                      data-test={`input-sub-category-${cat._id}`}
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
                      data-test={`add-sub-category-${cat._id}`}
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
                            data-test={`sub-category-${sub._id}`}
                            className="flex justify-between items-center"
                          >
                            <span>{sub.subCategoryName}</span>
                            <div className="flex gap-2">
                              <button
                                data-test={`edit-sub-category-${sub._id}`}
                                onClick={() => handleOpenEditSub(sub)}
                                className="text-yellow-600 hover:underline text-sm"
                              >
                                แก้ไข
                              </button>
                              <button
                                data-test={`delete-sub-category-${sub._id}`}
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
        isOpen={editMainState.isOpen}
        name={editMainState.name}
        image={editMainState.image}
        onChangeName={(name) => setEditMainState((prev) => ({ ...prev, name }))}
        onChangeImage={(image) =>
          setEditMainState((prev) => ({ ...prev, image }))
        }
        onConfirm={handleUpdateMainCategory}
        onClose={handleCloseEditMain}
      />

      <ModalEditSubCategory
        isOpen={editSubState.isOpen}
        subCategory={editSubState.selectedSub}
        onClose={handleCloseEditSub}
        onConfirm={handleUpdateSubCategory}
      />
    </div>
  );
};

export default ManageCategories;
