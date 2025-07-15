const Order = require("../models/Order.js");

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
