const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contentCategorySchema = new Schema({
  language: { 
    type: String,
    required: true 
  },
  name: { 
    type: String,
    required: true,
  },
  createdAt: { 
    type: Date,
    default: Date.now 
  }
});

module.exports = mongoose.model('ContentCategory', contentCategorySchema);
