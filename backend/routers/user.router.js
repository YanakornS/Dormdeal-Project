const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

//http://localhost:5000/api/v1/user/sign
router.post("/sign", userController.sign);
//http://localhost:5000/api/v1/user/
router.post("/", userController.addUser);

module.exports = router;
