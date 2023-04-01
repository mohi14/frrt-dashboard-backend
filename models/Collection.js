const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    address: {type: String, lowercase: true},  // collection address
    name: String,  // name of collection
    symbol: String,  // symbol of collection
    image: String,  // collection image
    description: String,  // collection description
    isPublic: {type: Boolean, default: false},  // true: usable for any user, false: usable for owner only
    timestamp: {type: Number, index: true},
});

CollectionSchema.index({address: 1}, {unique: true});
CollectionSchema.index({name: 1, isPublic: 1});
CollectionSchema.index({timestamp: 1});

module.exports.Collection = mongoose.model('collections', CollectionSchema);
