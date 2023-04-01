const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    id: {type: String, unique: true, index: true},
    name: String,
});

module.exports.Category = mongoose.model('categories', CategorySchema);
