const mongoose = require('mongoose');
// Fractional NFT Information (FraNFT: Fractional NFT)
const FractionSchema = new mongoose.Schema({
    address: {type: String, lowercase: true}, // Fra contract address
    txhash: String,  // traction id of creation or latest update
    name: String,  // name of FraNFT
    symbol: String,  // symbol of FraNFT
    supply: Number,  // total supply of FraNFT
    price: Number,  /// price of every token of FraNFT (reserve price)
    target: String,  // collection address of regular NFT that is used to create a FraNFT
    tokenId: Number,  // token id of regular NFT that is used to create a FraNFT
    released: Boolean,  // false: available in network, true: FraNFT is not available
    seller: {type: String, lowercase: true},  // user who is created FraNFT
    flag: Boolean,  // false: Fixed Item, true: Auction Item
    kickoff: Number,  // When auction item, start time
    duration: Number,  // When auction item, duration
    fee: Number,  // When auction, the fee of FraNFT 
    timestamp: {type: Number, index: true},  // time of creation or latest update
});

FractionSchema.index({address: 1}, {unique: true});
FractionSchema.index({timestamp: 1});

module.exports.Fraction = mongoose.model('fractions', FractionSchema);
