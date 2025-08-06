const nodemailer = require("nodemailer");
const path = require("path");

exports.sendWelcomeEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.email,
    subject: "Welcome to Gigly!",
    html: `
      <div style="
        background-image: url('https://res.cloudinary.com/dw8mhnhu5/image/upload/v1754451027/Email_Bg_h59l5r.jpg');
        background-size: cover;
        background-position: center;
        padding: 40px 20px;
        text-align: center;
        font-family: Arial, sans-serif;
      ">
        <div style="
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 10px;
          padding: 30px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ">
          <img src="https://your-domain.com/path/to/gigly-logo.png" alt="Gigly Logo" style="max-width: 150px; margin-bottom: 20px;">
          <h1 style="color: #4CAF50; font-size: 28px; margin-bottom: 20px;">Welcome to Gigly!</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for registering with us. We're excited to have you on board!</p>
          <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">Get ready to explore amazing opportunities and connect with talented professionals.</p>
          <a href="https://your-gigly-website.com/dashboard" style="
            background-color: #4CAF50;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
          ">Get Started</a>
        </div>
        <p style="color: #fff; font-size: 14px; margin-top: 20px;">© 2023 Gigly. All rights reserved.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent", info });
  } catch (error) {
    res.status(500).json({ message: "Email not sent", error });
  }
};
