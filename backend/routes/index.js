require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const jobController = require("../controllers/jobController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "text/plain"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and TXT files are allowed"));
    }
  },
});

// Routes
router.post("/upload", upload.single("file"), uploadController.uploadFile);
router.get("/job/:id/status", jobController.getJobStatus);
router.get("/job/:id/result", jobController.getJobResult);
router.post("/interest", jobController.registerInterest);

// Test route — hit this first to confirm server works
router.get("/health", (req, res) =>
  res.json({ status: "OK", message: "Server is running" }),
);

module.exports = router;
