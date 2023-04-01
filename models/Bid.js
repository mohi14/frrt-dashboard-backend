const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
    id: {type: String, index: true},
    timestamp: {type: Number, index: true},
    itemCollection: {type: String, index: true, lowercase: true},
    tokenId: {type: Number, index: true},
    auctionId: {type: Number, index: true},
    from: {type: String, index: true, lowercase: true,},
    bidPrice: Number,
});

BidSchema.index({id: 1, itemCollection: 1, tokenId: 1});
BidSchema.index({id: 1, itemCollection: 1, tokenId: 1, auctionId: 1}, {unique: true});

module.exports.Bid = mongoose.model('bids', BidSchema);
