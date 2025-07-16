const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gigId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Freelancer",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["processing", "in-progress", "submitted", "delivered"],
      default: "processing",
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
    gigTitle: {
      type: String,
      required: true,
    },
    freelancerName: {
      type: String,
      required: true,
    },
    deliveryFileUrl: {
      type: String,
    },
    deliveryMessage: {
      type: String,
    },
    clientRating: {
      type: Number,
      min: 0,
      max: 5,
    },
    clientFeedback: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
