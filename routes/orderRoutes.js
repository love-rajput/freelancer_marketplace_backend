const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrders,
  progress,
  deliverOrder,
  acceptOrder,
  getFreelancerOrders,
  leaveFeedback,
  getOrderById,
  getFreelancerRatings,
  getGigReviews,
} = require("../controllers/orderController");

router.post("/create-order", authMiddleware, createOrder);
router.get("/my-orders", authMiddleware, getOrders);
router.patch("/:id/progress", authMiddleware, progress);
router.patch("/:id/complete", authMiddleware, deliverOrder);
router.patch("/:id/accept", authMiddleware, acceptOrder);
router.patch("/:id/rate", authMiddleware, leaveFeedback);
router.get("/:id/single-order", authMiddleware, getOrderById);

// Freelancer Orders
router.get("/freelancer-order", authMiddleware, getFreelancerOrders);
router.post("/freelancer/rating", authMiddleware, getFreelancerRatings);
router.get("/gig/:gigId/reviews",authMiddleware, getGigReviews);

module.exports = router;
