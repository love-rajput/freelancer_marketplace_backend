const express = require("express");
const router = express.Router();
const Freelancer = require("../models/Freelancer");
const authMiddleware = require("../middleware/authMiddleware");

// Create Freelancer Profile
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { role, id } = req.user;

    if (role !== "freelancer") {
      return res
        .status(403)
        .json({ message: "Only freelancers can create profiles." });
    }

    // Check if profile already exists
    const existing = await Freelancer.findOne({ userId: id });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Profile already exists for this user." });
    }

    // Get data from body
    const { name, language, description, skills, avatar, category } = req.body;

    if (!name || !language || !description || !skills) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newFreelancer = new Freelancer({
      userId: id,
      name,
      language,
      description,
      skills,
      avatar,
      category,
    });

    await newFreelancer.save();

    res.status(201).json(newFreelancer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch freelancer profile by userId
router.get("/:userId", async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ userId: req.params.userId });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    res.json(freelancer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
