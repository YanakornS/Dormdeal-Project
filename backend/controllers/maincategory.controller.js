const MainCategory = require("../models/maincategory.model");

// ใน category.controller.js
exports.addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "กรุณาระบุชื่อหมวดหมู่" });
  }
  if (!req.file || !req.file.firebaseUrl)
    return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพ" });

  try {
    const existingCategory = await MainCategory.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(409).json({ message: "ชื่อหมวดหมู่มีอยู่แล้ว" });
    }
    const newCategory = new MainCategory({
      name: name.trim(),
      image: req.file.firebaseUrl,
      subCategories: [],
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดระหว่างการสร้างหมวดหมู่",
      error: error.message,
    });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const categories = await MainCategory.find().populate("subCategories");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดระหว่างการดึงหมวดหมู่" });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await MainCategory.findById(id);
    if (!categories) {
      res.status(404).send({
        message: "ไม่พบหมวดหมู่ที่ระบุ",
      });
      return;
    }
    res.json(categories);
  } catch (error) {
    res.status(500).send({
      message: "เกิดข้อผิดพลาดระหว่างการดึงหมวดหมู่",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const updateData = {};

    if (name) updateData.name = name;

    if (req.file?.firebaseUrl) {
      updateData.image = req.file.firebaseUrl;
    }
     if (name) {
      const existing = await MainCategory.findOne({ 
        name, 
        _id: { $ne: req.params.id } 
      });
      if (existing) {
        return res.status(400).json({ message: "ชื่อหมวดหมู่ซ้ำ กรุณาใช้ชื่ออื่น" });
      }
    }
    const updated = await MainCategory.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "ไม่พบหมวดหมู่ที่ระบุ" });
    }

    return res.status(200).json({
      message: "อัปเดตหมวดหมู่สำเร็จ"
    });
  } catch (error) {
  console.error("Update Category Error:", error);
  return res.status(500).json({ message: error.message || "เกิดข้อผิดพลาดในการอัปเดต" });
}
}

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // หา category ก่อน
    const category = await MainCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "ไม่พบหมวดหมู่ที่ระบุ" });
    }

    // เช็คว่ามี subCategories หรือไม่
    if (category.subCategories && category.subCategories.length > 0) {
      return res.status(400).json({
        message: "ไม่สามารถลบหมวดหมู่นี้ได้ เพราะมีหมวดย่อยอยู่"
      });
    }

    // ถ้าไม่มี subCategories จึงลบได้
    await MainCategory.findByIdAndDelete(id);

    return res.status(200).json({ message: "ลบหมวดหมู่เรียบร้อยแล้ว" });
  } catch (error) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดระหว่างการลบหมวดหมู่",
      error: error.message,
    });
  }
};
