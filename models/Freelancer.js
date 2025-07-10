const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true  // ensure 1 freelancer profile per user
  },
  username: { 
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  avatar: {
    type: String,
    default: ''
  },
  orders: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Freelancer', freelancerSchema);
