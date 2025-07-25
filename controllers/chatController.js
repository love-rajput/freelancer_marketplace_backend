const Conversation = require("../models/Conversation.js");
const Message = require("../models/Message.js");
const User = require("../models/User.js");

exports.createConversation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = new Conversation({ members: [senderId, receiverId] });
      await conversation.save();
    }
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, message } = req.body;
    const newMessage = new Message({
      conversationId,
      senderId,
      receiverId,
      message,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user.id] },
    }).populate("members", "username avatar");
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

