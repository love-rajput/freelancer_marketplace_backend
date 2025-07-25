const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  members: [String], // userid1 and userid2
});

module.exports = mongoose.model("Conversation", conversationSchema);
