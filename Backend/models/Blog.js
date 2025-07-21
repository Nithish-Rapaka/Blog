const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['Labs', 'Theory'], required: true },
  previewDescription: String,
  content: { type: String, required: true },
  purpose: String,
  uploadLinks: [String]
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
