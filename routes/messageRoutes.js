const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

//Get all message
router.get(
  "/messages/:conversationId",
  authMiddleware,
  chatController.getMessages
);

// @route   POST /api/chat/conversation
// @desc    Create new or return existing conversation between two users
// @access  Private
router.post("/conversation", authMiddleware, chatController.createConversation);

// @route   GET /api/chat/conversations
// @desc    Get all conversations of the logged-in user
// @access  Private
router.get("/conversations", authMiddleware, chatController.getConversations);

// @route   POST /api/chat/message
// @desc    Send a message
// @access  Private
router.post("/message", authMiddleware, chatController.sendMessage);

// Example Express route (Backend)
router.post("/conversations/add-client", chatController.addClientToList);
router.get("/conversations/clients", chatController.getAllClients);
module.exports = router;
