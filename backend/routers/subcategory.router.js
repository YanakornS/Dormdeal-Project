const express = require("express");
const router = express.Router();
const subcategory = require("../controllers/subcategory.controller");
const authJwt = require("../middlewares/auth.middleware");

//http://localhost:5000/api/v1/subcategory/sub
router.post(
  "/",
//   authJwt.verifyToken,
//   authJwt.isMod,
  subcategory.addSubCategory
);

//http://localhost:5000/api/v1/subcategory/sub
router.get("/sub", subcategory.getSubCategories);
//http://localhost:5000/api/v1/subcategory/id
router.get("/:id", subcategory.getSubCategoryById);
//http://localhost:5000/api/v1/subcategory/id
router.put(
  "/:id",
  authJwt.verifyToken,
  authJwt.isMod,
  subcategory.updateSubCategory
);
//http://localhost:5000/api/v1/subcategory/id
router.delete(
  "/:id",
  authJwt.verifyToken,
  authJwt.isMod,
  subcategory.deleteSubCategory
);

module.exports = router;
