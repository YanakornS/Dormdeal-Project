// routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller")
const authJwt = require("../middlewares/auth.middleware");

router.post("/", reportController.createReport);
router.get("/", authJwt.verifyToken, authJwt.isMod, reportController.getAllReports);
router.get("/:id", authJwt.verifyToken, authJwt.isMod, reportController.getReportById);
router.delete("/:id", authJwt.verifyToken, authJwt.isMod, reportController.deleteReport);

module.exports = router;
