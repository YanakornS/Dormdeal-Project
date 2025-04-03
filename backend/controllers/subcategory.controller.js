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

    // mainCategory.subCategories.push(subCategoryName)
    const subexits = mainCategory.subCategories.includes(subCategoryName);
    if (subexits) {
      return res.status(409).json({ message: "subcategory already" });
    }
    console.log(subCategoryName);

    // เพิ่ม ObjectId ของ SubCategory ไปที่ MainCategory
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
    const subcategories = await SubCategory.find()
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
    const subcategory = await SubCategory.findById(id);
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
exports.updateSubCategory = async (req,res)=>{
  const {id}= req.params;
  const {name} =req.body;
  if(!name){
    return res.status(404).json({message:"SubCategory name is required"})
  }
  try{
    const subcategory = await SubCategory.findByIdAndUpdate(
      id,
      {name},
      { new: true }
    )
    if(!subcategory){
    res.status(404).send({message:"SubCategory not found"})
    }
    res.status(200).send({message:"Update SubCategory successfully"})
  }catch(error){
    res.status(500).send({
      message:"An error occurred while Update subcategory"
    })
  }
}

exports.deleteSubCategory = async(req,res)=>{
  const {id} = req.params;
  try{
    const subcategory = await SubCategory.findByIdAndDelete(id);
    if(!subcategory){
      res.status(400).send({message:"SubCategory not found"})
    }
    res.status(200).send({message:"Delete SubCategory successfully"})
  }catch(error){
    res.status(500).send({
      message:"An error occurred while Delete subcategory"
    })
  }
}
  