const mongoose = require('mongoose');

const PairSchema = new mongoose.Schema({
    id: {type: Number, index: true},
    timestamp: {type: Number, index: true},
    itemCollection: {type: String, index: true, lowercase: true},
    tokenId: {type: Number, index: true},
    owner: {type: String, lowercase: true},
    price: Number,
    bValid: Boolean,
});

PairSchema.index({id: 1});
PairSchema.index({tokenId: 1, itemCollection: 1});
PairSchema.index({id: 1, tokenId: 1, itemCollection: 1, bValid: 1});

module.exports.Pair = mongoose.model('pairs', PairSchema);
