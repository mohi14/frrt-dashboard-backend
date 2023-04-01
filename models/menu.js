const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  menuName: {type: String, required: true},
  icon: {type: String, required: true},
  sort: {type: Number, required: true},
  permisionId: {type: Number, required: true},
  componentPath: {type: String, required: true},
  status: {type: String, default: 'active'},
  createdAt: {type: Date, default: Date.now},
  operation: {type: String, default: 'active'},
});

MenuSchema.index({id: 1});
MenuSchema.index({tokenId: 1, itemCollection: 1, active: 1});

module.exports = mongoose.model('Menus', MenuSchema);
