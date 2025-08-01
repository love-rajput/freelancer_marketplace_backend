const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [String],
      required: true,
    }, // userid1 and userid2
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
