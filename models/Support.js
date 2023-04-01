const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
  language: { type: String, required: true },
  title: { type: String, required: true },
  // Add more fields here if needed
});

const Support = mongoose.model('Support', supportSchema);

module.exports = Support;
