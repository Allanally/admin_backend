const mongoose = require('mongoose');

const FaultingSchema = new mongoose.Schema({
    fault: String,
    category: String,
    marks: String
})

const FaultingModel = mongoose.model('faulting', FaultingSchema)
module.exports = FaultingModel