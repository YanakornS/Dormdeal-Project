const MainCategory = require ("../models/maincategory.model")

// ใน category.controller.js
exports.addCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Category name  is required" });
  }
  if (!req.file || !req.file.firebaseUrl)
    return res.status(400).json({ message: "Image is required" });

  try {
    const newCategory = new MainCategory({
      name,
      image: req.file.firebaseUrl,
      subCategories: [], // ตั้งค่า default ไว้ก่อน
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.log("CATEGORY CREATE ERROR:", error); // log error
    res.status(500).json({
      message: "Something went wrong while creating the category",
      error: error.message,
    });
  }
};

  exports.getCategory = async (req, res) => {
    try {
      const categories = await MainCategory.find().populate("subCategories");
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching categories" });
    }
  };

exports.getCategoryById = async (req,res) =>{
  const {id} = req.params;
  try{
    const categories = await MainCategory.findById(id)
    if(!categories){
      res.status(404).send({
        message:"categories not found"
      })
      return;
    }
    res.json(categories)
  }catch(error){
    res.status(500).send({
      message:"Something error occurred while getting category"
    })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const updateData = {};
    if (name) updateData.name = name;

   
    
    if (req.file?.firebaseUrl) {
      updateData.image = req.file.firebaseUrl;
    }

    const updated = await MainCategory.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต", error: error.message });
  }
};


exports.deleteCategory = async (req,res)=>{
  const {id} = req.params;
  try{
    const category = await MainCategory.findByIdAndDelete(id);
    if(!category){
      return res.status(404).json({message:"Category not found"})
    }
    return res.status(200).send({message:"Deleted MainCategory successfully"});
  }catch (error) {
    res.status(500).json({
      message: "Something went wrong while deleted the category",
      error: error.message,
    });
  }
}