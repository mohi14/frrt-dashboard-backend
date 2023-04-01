const mongoose = require('mongoose');

const commodityGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  commodities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commodity'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true
});

module.exports = mongoose.model('CommodityGroup', commodityGroupSchema);
