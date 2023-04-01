const mongoose = require('mongoose');

const SoldSchema = new mongoose.Schema({
    id: {type: String, index: true},
    timestamp: {type: Number, index: true},
    itemCollection: {type: String, index: true, lowercase: true},
    tokenId: {type: Number, index: true},
    name: String,
    from: String,
    to: String,
    price: Number,
    metadata: String,
});
SoldSchema.index({id: 1, timestamp: 1});
SoldSchema.index({tokenId: 1, itemCollection: 1, timestamp: 1});
SoldSchema.index({itemCollection: 1, name: 1, timestamp: 1});
SoldSchema.index({itemCollection: 1, from: 1, timestamp: 1});
SoldSchema.index({itemCollection: 1, to: 1, timestamp: 1});

module.exports.Sold = mongoose.model('solds', SoldSchema);
