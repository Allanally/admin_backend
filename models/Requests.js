const mongoose = require('mongoose')
const RequestSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: [true, 'email already used'],
        required: [true, 'Plaese enter Email'],
        lowercase: true
     },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Password is too short']
    },
    role: {
        type: String,
        required: [true, 'Select Role']
    }
   
})


const RequestModel = mongoose.model("requests", RequestSchema)
module.exports = RequestModel


