const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
    id: {
        type: Number, 
        index: true, 
        required: true
    },
    contractAddress: {
        type: String, 
        required: true
    },
    chain: {
        type: String, 
        index: true, 
        required: true
    },
    previewURL: {
        type: String
    },
    owner: {
        type: String, 
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    contractCurrency: {
        type: String, 
        required: true
    },
    tokenStardard: {
        type: String, 
        required: true
    },
    status: {
        type: String, 
        required: true
    },
    creationTime: {
        type: Number, 
        required: true
    },
    chained: {
        type: Boolean, 
        required: true
    },
    isReleased: {
        type: Boolean, 
        required: true
    },
    groupId: {
        type: Number, 
        required: true
    },
    externalUrl: {
        type: String
    },
    description: {
        type: String
    },
    creator: {
        type: String, 
        required: true
    },
    updateTime: {
        type: Number, 
        required: true
    },
    TradingTime: {
        type: Number, 
        required: true
    },
    salesTime: {
        type: Number, 
        required: true
    },
});

AuctionSchema.index({id: 1});
AuctionSchema.index({tokenId: 1, itemCollection: 1, active: 1});

module.exports = mongoose.model('Auctions', AuctionSchema);
