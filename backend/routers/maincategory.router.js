const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/maincategory.controller");
const authJwt = require("../middlewares/auth.middleware");
const { upload, uploadToFirebase } = require("../middlewares/file.midleware");

//http://localhost:5000/api/v1/maincategory
router.post(
  "/",
  // authJwt.verifyToken,
  upload,
  uploadToFirebase,
  // authJwt.isMod,
  categoryController.addCategory
);

//http://localhost:5000/api/v1/maincategory
router.get("/", categoryController.getCategory);
//http://localhost:5000/api/v1/maincategory/id
router.get("/:id", categoryController.getCategoryById);
//http://localhost:5000/api/v1/maincategory/id
router.put(
  "/:id",
  authJwt.verifyToken,
  upload,
  uploadToFirebase,
  authJwt.isMod,
  categoryController.updateCategory
);
//http://localhost:5000/api/v1/maincategory/id
router.delete(
  "/:id",
  authJwt.verifyToken,
  authJwt.isMod,
  categoryController.deleteCategory
);

module.exports = router;
