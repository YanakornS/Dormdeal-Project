// ModalEditSubCategory.jsx
import React, { useState, useEffect } from "react";

const ModalEditSubCategory = ({ isOpen, onClose, onConfirm, subCategory }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(subCategory?.subCategoryName || "");
  }, [subCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-20 backdrop-blur-sm">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h3 className="text-xl font-semibold mb-4">แก้ไขหมวดย่อย</h3>
        <input
          type="text"
          className="input input-bordered w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn btn-ghost">
            ยกเลิก
          </button>
          <button
            onClick={() => onConfirm(name)}
            className="btn btn-success"
          >
            บันทึก
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ModalEditSubCategory;
