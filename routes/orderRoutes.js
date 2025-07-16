const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createOrder, getOrders,progress, deliverOrder, accpetOrder, getFreelancerOrders } = require("../controllers/orderController");

router.post("/create-order", authMiddleware, createOrder);
router.get('/my-orders', authMiddleware, getOrders);
router.patch('/:id/progress', authMiddleware,progress )
router.patch('/:id/complete', authMiddleware, deliverOrder);
router.post('/:id/accept',authMiddleware, accpetOrder )


// Freelancer Orders
router.get("/freelancer-order",authMiddleware, getFreelancerOrders);
module.exports = router;
