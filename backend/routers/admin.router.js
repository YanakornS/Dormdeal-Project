const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authJwt = require("../middlewares/auth.middleware");

router.post("/", authJwt.verifyToken,authJwt.isAdmin,adminController.createMod);

router.put("/user-status", authJwt.verifyToken,authJwt.isAdmin,adminController.updateUserStatus);
router.post("/mod-login", adminController.loginMod);


module.exports = router;