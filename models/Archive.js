const mongoose = require('mongoose')

const ArchiveSchema = new mongoose.Schema({
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
})

const ArchiveModel = mongoose.model('archive', ArchiveSchema);

module.exports = ArchiveModel;