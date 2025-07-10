const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({ 
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    freelancerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model('Gig', gigSchema)