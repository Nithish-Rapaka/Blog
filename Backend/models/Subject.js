const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  year: { type: String, required: true },        // e.g. "1st Year"
  semester: { type: String, required: true },    // e.g. "Semester 1"
  subjectName: { type: String, required: true }, // e.g. "Mathematics"
  links: [
    {
      url: { type: String, required: true },
      description: { type: String, required: true },
      _id: false, // prevents automatic _id for subdocs
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
