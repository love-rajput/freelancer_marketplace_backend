const Order = require("../models/Order.js");
const Freelancer = require("../models/Freelancer.js");
const mongoose = require("mongoose");

exports.createOrder = async (req, res) => {
  try {
    const {
      userId,
      gigId,
      freelancerId,
      price,
      stripeSessionId,
      gigTitle,
      freelancerName,
      status = "processing",
    } = req.body;

    const order = new Order({
      userId,
      gigId,
      freelancerId,
      price,
      status,
      stripeSessionId,
      gigTitle,
      freelancerName,
    });
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error in orderController:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }) // <-- use id
      .populate("freelancerId", "freelancerName avatar")
      .populate("gigId", "title thumbnail")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.progress = async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  // Find freelancer profile for logged-in user
  const freelancer = await Freelancer.findOne({ userId: req.user.id });
  if (!freelancer) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (order.freelancerId.toString() !== freelancer._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  if (order.status !== "processing") {
    return res.status(400).json({ message: "Order is not in progress" });
  }
  order.status = "in-progress";
  await order.save();
  res.status(200).json({ message: "Order in progress" });
};

exports.deliverOrder = async (req, res) => {
  const { deliveryFileUrl, deliveryMessage } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = "submitted";
    order.deliveryFileUrl = deliveryFileUrl;
    order.deliveryMessage = deliveryMessage;
    await order.save();
    res.status(200).json({ message: "Order submitted successfully" });
  } catch (error) {
    console.error("Error delivering order:", error);
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    order.status = "delivered";
    await order.save();
    res.status(200).json({ message: "Order delivered", order });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.leaveFeedback = async (req, res) => {
  const { rating, review } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.clientRating = rating;
    order.clientFeedback = review;
    await order.save();
    res.status(200).json({ message: "Feedback submitted successfully", order });
  } catch (error) {
    console.error("Error leaving feedback:", error);
  }
};

exports.getFreelancerOrders = async (req, res) => {
  try {
    const freelancerid = await Freelancer.findOne({ userId: req.user.id });
    if (!freelancerid) {
      return res.status(404).json({ message: "Freelancer not found" });
    }
    const orders = await Order.find({ freelancerId: freelancerid._id })
      .populate("userId", "username email")
      .populate("gigId", "title price thumbnail")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching freelancer orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "username avatar")
      .populate("gigId", "title thumbnail");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getFreelancerRatings = async (req, res) => {
  try {
    const { ids } = req.body;

    const ratings = await Promise.all(
      ids.map(async (freelancerId) => {
        const orders = await Order.find({
          freelancerId,
          clientRating: { $exists: true },
          clientFeedback: { $exists: true },
        }).populate("userId", "username avatar");

        const averageRating =
          orders.reduce((acc, curr) => acc + curr.clientRating, 0) /
            orders.length || 0;

        return {
          freelancerId,
          averageRating: averageRating.toFixed(1),
          totalReviews: orders.length,
          reviews: orders.map((order) => ({
            rating: order.clientRating,
            feedback: order.clientFeedback,
            client: order.userId, // username + avatar
          })),
        };
      })
    );

    res.json(ratings);
  } catch (error) {
    console.error("Error fetching freelancer ratings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get reviews and average rating for a gig
exports.getGigReviews = async (req, res) => {
  try {
    const { gigId } = req.params;
    // Find all orders for this gig with valid client feedback and rating
    const orders = await Order.find({
      gigId,
      clientFeedback: { $exists: true, $ne: null },
      clientRating: { $exists: true, $ne: null },
    }).populate("userId", "username avatar");

    // Filter out orders with invalid ratings
    const validOrders = orders.filter(
      (o) => typeof o.clientRating === "number" && !isNaN(o.clientRating)
    );

    const totalReviews = validOrders.length;
    const averageRating =
      totalReviews > 0
        ? validOrders.reduce((sum, o) => sum + o.clientRating, 0) / totalReviews
        : null;

    const reviews = validOrders.map((order) => ({
      clientRating: order.clientRating,
      clientFeedback: order.clientFeedback,
      userId: order.userId, // { username, avatar }
    }));

    res.json({
      averageRating,
      totalReviews,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching gig reviews:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
