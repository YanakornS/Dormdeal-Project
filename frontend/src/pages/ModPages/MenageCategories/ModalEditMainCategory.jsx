const ModalEditMainCategory = ({
  isOpen,
  name,
  image,
  onChangeName,
  onChangeImage,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const isFile = image && typeof image !== "string";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-base-200/50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <h2 className="text-xl font-bold mb-4"data-test="modal-edit-main-category-title">แก้ไขหมวดหมู่หลัก</h2>

        <input
          type="text"
          className="input input-bordered w-full mb-4" data-test="edit-main-category"
          placeholder="ชื่อหมวดหมู่"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="file-input file-input-bordered w-full mb-2"
          onChange={(e) => onChangeImage(e.target.files[0])}
        />

        {image && (
          <div className="mt-2">
            <img
              src={isFile ? URL.createObjectURL(image) : image}
              alt="preview"
              className="w-100 h-100 object-cover rounded mb-2 border"
            />
            <p className="text-sm text-gray-500 text-center">
              {isFile ? "ภาพใหม่ที่เลือก" : "ภาพเดิม"}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
  <button
    className="btn btn-ghost"
    onClick={onClose}
    data-test="button-edit-cancel"
  >
    ยกเลิก
  </button>
  <button
    className="btn btn-primary"
    onClick={onConfirm}
    data-test="button-edit-confirm"
  >
    ยืนยัน
  </button>
</div>
      </div>
    </div>
  );
};

export default ModalEditMainCategory;
