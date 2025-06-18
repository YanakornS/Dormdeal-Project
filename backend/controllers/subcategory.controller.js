const MainCategory = require("../models/maincategory.model")

exports.addSubCategory = async (req, res) => {
  const { mainCategoryId, subCategoryName } = req.body;

  if (!mainCategoryId || !subCategoryName) {
    return res
      .status(400)
      .json({ message: "Main category ID and subcategory name are required" });
  }

  try {
    // ค้นหา MainCategory
    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) {
      return res.status(404).json({ message: "Main category not found" });
    }

    // include ไส้ตรวจสอบ subname 
    const subexits = mainCategory.subCategories.includes(subCategoryName);
    if (subexits) {
      return res.status(409).json({ message: "subcategory already" });
    }
    console.log(subCategoryName);

    // เพิ่ม SubCategory ไปที่ MainCategory 
    mainCategory.subCategories.push({ subCategoryName: subCategoryName });
    console.log(mainCategory);

    await mainCategory.save();
    res.status(201).json(mainCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding subcategory", error: error.message });
  }
};

exports.getSubCategories = async(req,res) =>{
  try{
    const subcategories = await MainCategory.find()
    res.json(subcategories);
  } catch (error) {
    res.status(500).send({
      message: "An error occurred while fetching subcategories ",
    });
  }
}


exports.getSubCategoryById = async(req,res)=>{
  const {id} = req.params
  try{
    const subcategory = await MainCategory.findById(id);
    if(!subcategory){
      res.status(404).send({message:"SubCategory not found"})
      return
    }
    res.json(subcategory)
  }catch(error){
    res.status(500).send({
      message:"An error occurred while fetching subcategory"
    })
  }
}

// exports.updateSubCategory = async (req,res)=>{
//   const {id}= req.params;
//   const {name} =req.body;
//   if(!name){
//     return res.status(404).json({message:"SubCategory name is required"})
//   }
//   try{
//     const subcategory = await MainCategory.findByIdAndUpdate(
//       id,
//       {name},
//       { new: true }
//     )
//     if(!subcategory){
//     res.status(404).send({message:"SubCategory not found"})
//     }
//     res.status(200).send({message:"Update SubCategory successfully"})
//   }catch(error){
//     res.status(500).send({
//       message:"An error occurred while Update subcategory"
//     })
//   }
// }

//Edit by Kays
exports.updateSubCategory = async (req, res) => {
  const { id } = req.params; // id คือ _id ของ subcategory
  const { subCategoryName } = req.body;

  if (!subCategoryName) {
    return res.status(400).json({ message: "Subcategory name is required" });
  }

  try {
    // หาหมวดหลักที่มีหมวดย่อยที่เราต้องการอัปเดต
    const mainCategory = await MainCategory.findOne({
      "subCategories._id": id,
    });

    if (!mainCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    // method id ใช้ดึงค่าในelement 
    const sub = mainCategory.subCategories.id(id);
    sub.subCategoryName = subCategoryName;

    await mainCategory.save();

    res.status(200).json({ message: "Update subcategory successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating subcategory",
      error: error.message,
    });
  }
};


// exports.deleteSubCategory = async(req,res)=>{
//   const {id} = req.params;
//   try{
//     const subcategory = await MainCategory.findByIdAndDelete(id);
//     if(!subcategory){
//       res.status(400).send({message:"SubCategory not found"})
//     }
//     res.status(200).send({message:"Delete SubCategory successfully"})
//   }catch(error){
//     res.status(500).send({
//       message:"An error occurred while Delete subcategory"
//     })
//   }
// }
  
//Edit by Kays
exports.deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const mainCategory = await MainCategory.findOne({
      "subCategories._id": id,
    });

    if (!mainCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    // ใช้ filter ตัด subCategory ออก
    mainCategory.subCategories = mainCategory.subCategories.filter(
      (sub) => sub._id.toString() !== id
    );

    await mainCategory.save();

    res.status(200).json({ message: "Delete SubCategory successfully" });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({
      message: "An error occurred while deleting subcategory",
      error: error.message,
    });
  }
};
