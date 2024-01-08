const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
  },
  stream: {
    type: String,
  },
});

const StudentModel = mongoose.model('student', studentSchema);

module.exports = StudentModel;
