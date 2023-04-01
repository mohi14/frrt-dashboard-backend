const mongoose = require('mongoose');
// NFT item of Regular NFT(ReNFT)
const ItemSchema = new mongoose.Schema({
    id: {type: String, index: true},  // unique string
    timestamp: {type: Number, index: true},  // latest updated time
    itemCollection: {type: String, index: true, lowercase: true},  // collection address
    tokenId: {type: Number, index: true},  // token id of ReNFT
    creator: {type: String, lowercase: true},  // user wallet address who is created this NFT
    owner: {type: String, lowercase: true},  // user wallet address who is hold
    itemOwner: {type: String, lowercase: true}, // pair, auction owner
    tokenURI: String,
    position: Number,  // 0: user's wallet, 1: Regular Fixed, 2: Regular Auction, 3: Fra Fixed, 4: Fra Auction

    assetType: String,  // image type: image, audio, video
    category: {type: String, index: true},

    name: {type: String, index: true},
    description: String, //item description
    mainData: String, //item data link
    coverImage: String, //cover image link
    propertyTypes: Array,  // list of trait_type in properties
    propertyValues: Array,  // list of value in properties

    itemStatus: {type: Boolean, default: true},  // true: usable in marketplace, false: not usable in marketplace
    likeCount: {type: Number, default: 0},  // number of favorites
    likes: [{type: String, lowercase: true}], //addresses  // addresses of favorites
    fetchCount: {type: Number, default: 0},
    created_at: Date,
    updated_at: Date,
});

ItemSchema.index({itemCollection: 1, itemStatus: 1});
ItemSchema.index({itemCollection: 1, tokenId: 1, itemStatus: 1}, {unique: true});
ItemSchema.index({mainData: 1, fetchCount: 1,  itemStatus: 1});
ItemSchema.index({name: 1, creator: 1, owner: 1, itemOwner: 1, category: 1, timestamp: 1, itemStatus: 1});

module.exports.Item = mongoose.model('items', ItemSchema);
