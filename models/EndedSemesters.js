const mongoose = require('mongoose');

const endedSemesterSchema = new mongoose.Schema({
  semesterName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
});

const EndedSemesterModel = mongoose.model('endedSemester', endedSemesterSchema);

module.exports = EndedSemesterModel;
