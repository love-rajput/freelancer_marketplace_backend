const express = require("express");
const router = express.Router();
const { sendWelcomeEmail } = require('../controllers/mailController');

// Email to user when loggedin

router.post("/email", sendWelcomeEmail);

module.exports = router;
