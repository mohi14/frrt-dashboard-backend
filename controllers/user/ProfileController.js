const BaseController = require('../BaseController');
const UserModel = require("../../models/User").User;
const ItemModel = require("../../models/Item").Item;
const PairModel = require("../../models/Pair").Pair;
const CollectionModel = require("../../models/Collection").Collection;
const AuctionModel = require("../../models/Auction");
const BidModel = require("../../models/Bid").Bid;
const EventModel = require("../../models/Event").Event;

const e_marketAddr = process.env.MARKET_ADDR.toLowerCase();
const e_auctionAddr = process.env.AUCTION_ADDR.toLowerCase();
const e_profilePic = process.env.AVATAR_IMG;
const e_profileCover = process.env.COVER_IMG;
const e_pageLimit = parseInt(process.env.PAGE_LIMIT);

module.exports = BaseController.extend({
    name: 'ProfileController',
    dashboardAuction: async function (req, res, next) {
        let owner = req.query.owner?.toLowerCase() || "";
        if (!owner) return res.status(404).send({ message: "No Auction found" });
        let item = await ItemModel.findOne({ itemOwner: e_auctionAddr, itemStatus: true, owner: { $ne: owner } }, { __v: 0, _id: 0 }).lean();
        if (!item) return res.status(404).send({ message: "No Auction found" });
        item.ownerUser = await UserModel.findOne({ address: item.owner }, { __v: 0, _id: 0 }).lean();
        const auction = await AuctionModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, active: true }, { _id: 0, __v: 0 }).lean();
        if (auction) {
            item.bids = await BidModel.find({ auctionId: auction.id }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).lean();
            item.auction = auction;
        } else {
            item.bids = [];
            item.auction = null;
        }
        return res.status(200).send({item: item});
    },
    topCreators: async function (req, res, next) {
        let creators = await EventModel.aggregate([
            { $match: { $or: [{ name: 'MarketListed' }, { name: 'AuctionListed' }] } },
            { $group: { _id: "$from", length: { $sum: 1 } } },
            { $limit: e_pageLimit }
        ]);
        let ret = [];
        for (let i = 0; i < creators.length; i++) {
            creators[i].creator = await UserModel.findOne({ address: creators[i]._id }, { __v: 0, _id: 0 }).lean();
        }
        return res.status(200).send({ creators: creators });
    },
    bids: async function (req, res, next) {
        let owner = req.query.owner?.toLowerCase() || "";
        if (!owner) return res.status(404).send({ message: "No Bids found" });
        let bids = await BidModel.find({ from: owner }, { __v: 0, _id: 0 }).lean();
        let ret = [];
        for (let i = 0; i < bids.length; i++) {
            let node = bids[i];
            node.item = await ItemModel.findOne({ itemCollection: node.itemCollection, tokenId: node.tokenId }, { __v: 0, _id: 0 }).lean();
            node.owner = await UserModel.findOne({ address: owner }, { __v: 0, _id: 0 }).lean();
            node.auction = await AuctionModel.findOne({ id: node.auctionId }, { __v: 0, _id: 0 }).lean();
            ret.push(node);
        }
        let fixedCount = await PairModel.countDocuments({ bValid: true });
        let auctionCount = await EventModel.countDocuments({ name: 'AuctionListed' });
        let cancelCount = await EventModel.countDocuments({ name: 'AuctionDelisted' });
        let creatorCount = await UserModel.countDocuments({});
        let counts = { fixed: fixedCount, auction: auctionCount - cancelCount, creator: creatorCount, cancel: cancelCount };
        return res.status(200).send({ items: ret, counts: counts });
    },
    favorites: async function (req, res, next) {
        let userAddress = req.query.owner ? req.query.owner.toLowerCase() : 'None';
        if (userAddress === 'None') return res.send({ message: "user is none", items: [] });
        let items = await ItemModel.find({ likes: userAddress }, { _id: 0, __v: 0 }).limit(e_pageLimit).lean();
        let ret = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            // let owner = item.owner;
            if (item.itemOwner === e_marketAddr) {
                // marketplace item
                let pair = await PairModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, bValid: true }, { _id: 0, __v: 0 }).lean();
                if (pair) item.pair = pair;
            } else if (item.itemOwner === e_auctionAddr) {
                // auction item
                let auction = await AuctionModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, active: true }, { _id: 0, __v: 0 }).lean();
                if (auction) {
                    auction.price = auction.startPrice;
                    let bids = await BidModel.find({ auctionId: auction.id }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).lean();
                    auction.bids = bids;
                    if (bids.length > 0) auction.price = bids[0].bidPrice;
                    item.auction = auction;
                }
            }
            // set item creator
            let creator = await UserModel.findOne({ address: item.creator }, { _id: 0, __v: 0 }).lean();
            if (item.creator !== "0x" && item.creator !== "0x0000000000000000000000000000000000000000" && !creator) {
                const newUser = new UserModel({
                    address: item.creator.toLowerCase(),
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                item.creatorUser = newUser;
            } else {
                item.creatorUser = creator;
            }
            // set item owner
            let ownerUserItem = await UserModel.findOne({ address: item.owner }, { _id: 0, __v: 0 }).lean();
            if (item.owner !== "0x" && item.owner !== "0x0000000000000000000000000000000000000000" && !ownerUserItem) {
                const newUser = new UserModel({
                    address: item.owner,
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                item.ownerUser = newUser;
            } else {
                item.ownerUser = ownerUserItem;
            }
            ret.push(item);
        }
        return res.status(200).send({ items: ret });
    },
    collections: async function (req, res, next) {
        let userAddress = req.query.owner ? req.query.owner.toLowerCase() : 'None';
        if (userAddress === 'None') return res.send({ message: "user is none", items: [] });
        let items = await ItemModel.find({ owner: userAddress }, { __v: 0, _id: 0 }).limit(e_pageLimit).lean();
        let ret = [];
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            // let owner = item.owner;
            if (item.itemOwner === e_marketAddr) {
                // marketplace item
                let pair = await PairModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, bValid: true }, { _id: 0, __v: 0 }).lean();
                if (pair) item.pair = pair;
            } else if (item.itemOwner === e_auctionAddr) {
                // auction item
                let auction = await AuctionModel.findOne({ tokenId: item.tokenId, itemCollection: item.itemCollection, active: true }, { _id: 0, __v: 0 }).lean();
                if (auction) {
                    auction.price = auction.startPrice;
                    let bids = await BidModel.find({ auctionId: auction.id }, { _id: 0, __v: 0 }).sort({ bidPrice: -1 }).lean();
                    auction.bids = bids;
                    if (bids.length > 0) auction.price = bids[0].bidPrice;
                    item.auction = auction;
                }
            }
            // set item creator
            let creator = await UserModel.findOne({ address: item.creator }, { _id: 0, __v: 0 }).lean();
            if (item.creator !== "0x" && item.creator !== "0x0000000000000000000000000000000000000000" && !creator) {
                const newUser = new UserModel({
                    address: item.creator.toLowerCase(),
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                item.creatorUser = newUser;
            } else {
                item.creatorUser = creator;
            }
            // set item owner
            let ownerUserItem = await UserModel.findOne({ address: item.owner }, { _id: 0, __v: 0 }).lean();
            if (item.owner !== "0x" && item.owner !== "0x0000000000000000000000000000000000000000" && !ownerUserItem) {
                const newUser = new UserModel({
                    address: item.owner,
                    name: "NoName",
                    profilePic: e_profilePic,
                    profileCover: e_profileCover,
                    isApproved: false,
                    call_status: false,
                    call_time: (Date.now() / 1000),
                    nonce: Math.floor(Math.random() * 1000000)
                });
                await newUser.save();
                item.ownerUser = newUser;
            } else {
                item.ownerUser = ownerUserItem;
            }
            ret.push(item);
        }
        return res.status(200).send({ items: ret });
    },
    settingProfile: async function (req, res, next) { },
    settingApplication: async function (req, res, next) { },
    settingActivity: async function (req, res, next) { },
    settingPayment: async function (req, res, next) { },
});
