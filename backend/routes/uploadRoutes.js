const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");

const pipeline = promisify(require("stream").pipeline);

const router = express.Router();

const upload = multer();

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Accept only PDF by mimetype or extension
  const isPDF = file.mimetype === "application/pdf" || (file.originalname && file.originalname.toLowerCase().endsWith(".pdf"));
  if (!isPDF) {
    return res.status(400).json({ message: "Invalid format. Only PDF allowed." });
  }
  const filename = `${uuidv4()}.pdf`;
  fs.writeFile(`${__dirname}/../public/resume/${filename}`, file.buffer, (err) => {
    if (err) {
      console.error("Resume upload error:", err);
      return res.status(400).json({
        message: "Error while uploading",
        error: err.message,
      });
    }
    res.send({
      message: "File uploaded successfully",
      url: `/host/resume/${filename}`,
    });
  });
});

router.post("/profile", upload.single("file"), (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  // Accept only JPG or PNG by mimetype or extension
  const isImage = (file.mimetype === "image/jpeg" || file.mimetype === "image/png") ||
    (file.originalname && (file.originalname.toLowerCase().endsWith(".jpg") || file.originalname.toLowerCase().endsWith(".jpeg") || file.originalname.toLowerCase().endsWith(".png")));
  if (!isImage) {
    return res.status(400).json({ message: "Invalid format. Only JPG/PNG allowed." });
  }
  const ext = file.originalname.split('.').pop();
  const filename = `${uuidv4()}.${ext}`;
  fs.writeFile(`${__dirname}/../public/profile/${filename}`, file.buffer, (err) => {
    if (err) {
      console.error("Profile upload error:", err);
      return res.status(400).json({
        message: "Error while uploading",
        error: err.message,
      });
    }
    res.send({
      message: "Profile image uploaded successfully",
      url: `/host/profile/${filename}`,
    });
  });
});

module.exports = router;
