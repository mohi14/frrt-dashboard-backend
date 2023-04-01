const mongoose = require('mongoose');
// users that hold FraNFT(Fractional NFT)
const HolderSchema = new mongoose.Schema({
    id: String, // unique string
    fraction: {type: String, lowercase: true},  // FraNFT address
    account: {type: String, lowercase: true},  // User wallet address
    balance: Number,  // balance of FraNFT
    decimals: Number,  // decimal of FraNFT
    timestamp: {type: Number, index: true},  // latest updated time
});

HolderSchema.index({id: 1}, {unique: true});
HolderSchema.index({account: 1});
HolderSchema.index({fraction: 1});
HolderSchema.index({timestamp: 1});

module.exports.Holder = mongoose.model('holders', HolderSchema);
