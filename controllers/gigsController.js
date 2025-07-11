const Gigs = require("../models/Gigs");
const Freelancer = require("../models/Freelancer");
const User = require("../models/User");

exports.createGig = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const userId = req.user.id;
    const userRecord = await User.findById(userId);
    const freelancer = await Freelancer.findOne({ userId });
    if (!freelancer) {
      return res.status(404).json({ message: "Freelancer profile not found" });
    }

    if (!userRecord) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(title, description, category, price);
    if (!title || !description || !category || !price) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }
    const newGig = new Gigs({
      userId,
      freelancerId: freelancer._id,
      title,
      description,
      category,
      price,
      thumbnail: req.file?.path || "",
    });
    await newGig.save();
    res.status(201).json(newGig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// get all gigs
exports.getGigs = async (req, res) => {
  try {
    const gigs = await Gigs.find()
      .populate("userId", "username email")
      .populate("freelancerId", "avatar");
    res.status(200).json(gigs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get single gig
exports.getGig = async (req, res) => {
  try {
    const gig = await Gigs.findById(req.params.id)
      .populate("userId", "username email")
      .populate("freelancerId", "avatar");
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    res.status(200).json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// update gig
exports.updateGig = async (req, res) => {
  try {
    const { title, description, category, price } = req.body;
    const update = { title, description, category, price };
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: user not logged in" });
    }

    if (req.file?.path) {
      update.thumbnail = req.file.path;
    }

    const gig = await Gigs.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res.status(200).json(gig);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Gigs
exports.deleteGig = async (req, res) => {
  try {
    await Gigs.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Gig deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
