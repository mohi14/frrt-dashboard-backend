const mongoose = require('mongoose');
const { Schema } = mongoose;

const commoditySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  imageURI: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['art', 'music', 'video', 'game'],
    required: true
  },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }
//for the time being keep it simple
  owner: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Commodity', commoditySchema);
