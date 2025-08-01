const Conversation = require("../models/Conversation.js");
const Message = require("../models/Message.js");

// Create or get existing conversation
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

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, receiverId, message } = req.body;

    const newMessage = new Message({
      conversationId,
      senderId,
      receiverId,
      message,
      timestamp: new Date(), // Optional: Ensure sorting
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all conversations for a user
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

// ✅ Get all messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({
      timestamp: 1,
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Optional: Get latest message for each conversation
exports.getLatestMessageForEachConversation = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user.id] },
    });

    const latestMessages = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await Message.findOne({
          conversationId: conversation._id,
        }).sort({ timestamp: -1 });

        return {
          conversationId: conversation._id,
          members: conversation.members,
          lastMessage,
        };
      })
    );

    res.status(200).json(latestMessages);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
