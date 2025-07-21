const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  year: { type: String, required: true },
  semester: { type: String, required: true },
  labName: { type: String, required: true },
  links: [
    {
      url: String,
      description: String
    }
  ]
});

module.exports = mongoose.model('Lab', labSchema);
