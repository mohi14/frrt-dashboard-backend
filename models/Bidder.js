const mongoose = require('mongoose');

const BidderSchema = new mongoose.Schema({
    id: {type: String, index: true},  // unique string
    timestamp: {type: Number, index: true},
    txHash: String,
    fraction: {type: String, index: true, lowercase: true},  // FraNFT address
    from: {type: String, index: true, lowercase: true,},  // user wallet address who is placed a bid
    oldPrice: Number,   // previous price
    newPrice: Number,   // bid price
    count: Number,   // token amount of bid
    amount: Number,    // total amount in ETH
});

BidderSchema.index({fraction: 1});
BidderSchema.index({from: 1});
BidderSchema.index({fraction: 1, from: 1});

module.exports.Bidder = mongoose.model('bidders', BidderSchema);
