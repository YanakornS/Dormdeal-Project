const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const MainCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  image: { type: String, required: true },
  subCategories: [
    { subCategoryName: { type: String, required: false, unique: true } },
  ],
});

const MainCategoryModel = model("MainCategory", MainCategorySchema);
module.exports = MainCategoryModel;
