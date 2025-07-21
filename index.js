const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const mailRoutes = require("./routes/mail");
const freelancerRoutes = require("./routes/freelanceFetchRoute");
const gigsRoutes = require("./routes/gigsRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' https://js.stripe.com https://checkout.stripe.com 'unsafe-eval' 'unsafe-inline' blob:; " +
      "style-src 'self' https://checkout.stripe.com 'unsafe-inline'; " +
      "font-src 'self' data:; " +
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; " +
      "connect-src 'self' https://api.stripe.com https://maps.googleapis.com; " +
      "img-src 'self' https://*.stripe.com data: blob:;"
  );
  next();
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/freelancers", freelancerRoutes);
app.use("/api/gigs", gigsRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
