const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createGig,
  getGigs,
  getGig,
  updateGig,
  deleteGig,
  getMyGigs,
  getOtherFreelancerGigs,
} = require("../controllers/gigsController");
const upload = require("../middleware/uploadCloudinary");

router.post("/create", authMiddleware, upload.single("thumbnail"), createGig);
router.get("/", getGigs);
router.get("/my-gigs", authMiddleware, getMyGigs);
router.get("/others", authMiddleware, getOtherFreelancerGigs);
router.get("/:id", getGig);
router.put("/:id", authMiddleware, upload.single("thumbnail"), updateGig);
router.delete("/:id", authMiddleware, deleteGig);

module.exports = router;
