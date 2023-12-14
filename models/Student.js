const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  gender: String
});

const StudentModel = mongoose.model('student', studentSchema);

module.exports = StudentModel;
