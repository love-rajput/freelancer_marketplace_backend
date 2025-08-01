const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  username: { type: String, required: true },
  avatar: { type: String },
});

module.exports = mongoose.model("Client", clientSchema);
