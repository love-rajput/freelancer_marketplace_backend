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
    default: 'https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o='
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
