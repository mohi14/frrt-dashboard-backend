const mongoose = require('mongoose');
// All events of ReNFT, FraNFT
const EventSchema = new mongoose.Schema({
    id: {type: String, index: true},  // unique string
    timestamp: {type: Number, index: true},  // latest updated time
    txHash: String,  // transtaction hash of latest
    itemCollection: {type: String, index: true, lowercase: true},  // collection address when ReNFT, FraNFT address when FraNFT
    tokenId: {type: Number, index: true},  // token id when ReNFT, -1 is when FraNFT
    name: String,  // event name
    from: String,  // user wallet address of sender
    to: String,  // user wallet address of receiver 
    price: Number,  // amount of price in ETH
    count: Number,  // number of tokens when FraNFT
    amount: Number,  // spent amount for event
    metadata: String,  // extra description
});

EventSchema.index({id: 1, timestamp: 1});
EventSchema.index({tokenId: 1, itemCollection: 1, timestamp: 1});
EventSchema.index({itemCollection: 1, name: 1, timestamp: 1});
EventSchema.index({itemCollection: 1, from: 1, timestamp: 1});
EventSchema.index({itemCollection: 1, to: 1, timestamp: 1});

module.exports.Event = mongoose.model('events', EventSchema);
