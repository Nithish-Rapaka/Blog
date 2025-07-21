const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: String, required: true },              // track user
  date: { type: String, required: true },                // use string (YYYY-MM-DD) for easier querying
  present: { type: Boolean, required: true }
});

// prevent duplicate attendance for same user & date
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
