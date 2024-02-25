const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
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

const SemesterModel = mongoose.model('semester', semesterSchema);

module.exports = SemesterModel;
