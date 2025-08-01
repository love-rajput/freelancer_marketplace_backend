const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController.js");

// ...other routes...
router.post("/conversations/add-client", chatController.addClientToList);

module.exports = router;