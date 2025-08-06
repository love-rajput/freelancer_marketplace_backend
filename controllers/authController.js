const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: sendEmail } = require("../utils/sendMail");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, role, username } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      isVerified: false,
      otp,
      otpExpire,
    });

    await newUser.save();

    const emailHTML = `
      <div style="text-align:center; background-color: #1E1B22; padding: 20px; color: white;">
        <img src="https://res.cloudinary.com/dw8mhnhu5/image/upload/v1754451027/Email_Bg_h59l5r.jpg" alt="Gigly Logo" style="max-width: 200px; margin-bottom: 20px;">
        <p>Thank you for signing up. Please use the following OTP to verify your email:</p>
        <h2 style="color: #4CAF50;">${otp}</h2>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: emailHTML,
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      token,
      msg: "User registered. Verification OTP sent to your email.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    console.log("Save user otp", user.otp);
    console.log("Got otp", otp);

    if (user.otp !== otp || new Date(user.otpExpire).getTime() < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    // Generate token and return user data
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "Email verified successfully",
      token,
      id: user._id,
      user,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
      msg: "Login successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const emailHTML = `
      <div style="text-align:center; background-color: #1E1B22; padding: 20px; color: white;">
        <h2>Your new OTP for Gigly</h2>
        <h3>${otp}</h3>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Your new OTP for Gigly",
      html: emailHTML,
    });

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
