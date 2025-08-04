const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createFreelancer,
  getFreelancer,
} = require("../controllers/freelancerController");
const upload = require("../middleware/uploadCloudinary");
const Freelancer = require("../models/Freelancer"); // Import Freelancer model

router.post("/create", authMiddleware, createFreelancer);
router.get("/", authMiddleware, getFreelancer);

router.post(
  "/upload-image",
  authMiddleware,
  upload.single("avatar"), // Change "image" to "avatar" to match the field name in the form data
  async (req, res) => {
    // Add async to the route handler
    try {
      const freelancer = await Freelancer.findOne({ userId: req.user.id });
      if (!freelancer) {
        return res
          .status(404)
          .json({ message: "Freelancer profile not found" });
      }

      // Cloudinary gives you the URL in req.file.path
      freelancer.avatar = req.file.path;
      await freelancer.save();

      res
        .status(200)
        .json({ message: "Image uploaded", avatar: req.file.path });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
