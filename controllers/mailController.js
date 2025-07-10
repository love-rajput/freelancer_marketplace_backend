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
    subject: "Welcome to our Gigly",
    html: `
      <div style="text-align:center;">
        <h1>Welcome to our Gigly</h1>
        <p>Thank you for registering with us</p>
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
