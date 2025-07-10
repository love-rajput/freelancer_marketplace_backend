const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role:{
        type: String,
        enum: ['client', 'freelancer'],
        default: 'user'
    },
    password:{
        type: String,
        required: true,
    },
    
    
})

module.exports = mongoose.model('User', UserSchema)