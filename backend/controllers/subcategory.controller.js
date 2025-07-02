const MainCategory = require("../models/maincategory.model")

exports.addSubCategory = async (req, res) => {
  const { mainCategoryId, subCategoryName } = req.body;

  
  if (!mainCategoryId || !subCategoryName) {
    return res
      .status(400)
      .json({ message: "กรุณาระบุหมวดหมู่หลักและชื่อหมวดย่อย" });
  }

  try {
    
    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) {
      return res.status(404).json({ message: "ไม่พบหมวดหมู่หลัก" });
    }
    const newName = subCategoryName.trim().toLowerCase();
    const isDuplicate = mainCategory.subCategories.some(
      (sub) => sub.subCategoryName.trim().toLowerCase() === newName
    );
    if (isDuplicate) {
      return res.status(409).json({ message: "มีหมวดย่อยนี้อยู่แล้ว" });
    }
    mainCategory.subCategories.push({ subCategoryName: subCategoryName.trim() });
    await mainCategory.save();

    res.status(201).json(mainCategory);
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดขณะเพิ่มหมวดย่อย",
      error: error.message,
    });
  }
};


exports.getSubCategories = async(req,res) =>{
  try{
    const subcategories = await MainCategory.find()
    res.json(subcategories);
  } catch (error) {
    res.status(500).send({
      message: "เกิดข้อผิดพลาดขณะดึงข้อมูลหมวดย่อย",
    });
  }
}


exports.getSubCategoryById = async(req,res)=>{
  const {id} = req.params
  try{
    const subcategory = await MainCategory.findById(id);
    if(!subcategory){
      res.status(404).send({message:"ไม่พบหมวดย่อย"})
      return
    }
    res.json(subcategory)
  }catch(error){
    res.status(500).send({
      message:"เกิดข้อผิดพลาดขณะดึงข้อมูลหมวดย่อย"
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
  const { id } = req.params; 
  const { subCategoryName } = req.body;

  if (!subCategoryName) {
    return res.status(400).json({ message: "กรุณาระบุชื่อหมวดย่อยที่จะแก้ไข" });
  }

  try {
    // หาหมวดหลักที่มีหมวดย่อยที่เราต้องการอัปเดต
    const mainCategory = await MainCategory.findOne({
      "subCategories._id": id,
    });

    if (!mainCategory) {
      return res.status(404).json({ message: "ไม่พบหมวดย่อย" });
    }

    // method id ใช้ดึงค่าในelement 
    const sub = mainCategory.subCategories.id(id);
    sub.subCategoryName = subCategoryName;

    await mainCategory.save();
    res.status(200).json({ message: "อัปเดตหมวดย่อยเรียบร้อยแล้ว" });
  } catch (error) {
    res.status(500).json({
      message: "เกิดข้อผิดพลาดขณะอัปเดตหมวดย่อย",
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
      return res.status(404).json({ message: "ไม่พบหมวดย่อย" });
    }
    
    mainCategory.subCategories = mainCategory.subCategories.filter(
      (sub) => sub._id.toString() !== id
    );

    await mainCategory.save();

    res.status(200).json({ message: "ลบหมวดย่อยเรียบร้อยแล้ว" });
  } catch (error) {

    res.status(500).json({
      message: "เกิดข้อผิดพลาดขณะลบหมวดย่อย",
      error: error.message,
    });
  }
};
